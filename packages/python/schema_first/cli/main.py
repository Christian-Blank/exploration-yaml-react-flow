"""Main CLI module for the Schema-First Knowledge Graph System."""

import os
import sys
from pathlib import Path
from typing import Optional, List

import typer
import yaml
from rich.console import Console
from rich.table import Table

from schema_first.core.schemas import SchemaLoader, SchemaLoaderOptions
from schema_first.core.utils import BaseNode, CreateNodeOptions, create_base_node

# Create the Typer app
app = typer.Typer(
    name="schema-first",
    help="CLI for the Schema-First Knowledge Graph System",
    add_completion=False,
)

# Console for rich output
console = Console()


@app.callback()
def callback() -> None:
    """Schema-First Knowledge Graph System CLI.
    
    A command-line interface for working with schemas and nodes in the 
    Schema-First Knowledge Graph System.
    """
    pass


@app.command()
def validate(
    file_path: str = typer.Argument(..., help="Path to the file to validate"),
    schema_path: str = typer.Argument(..., help="Path to the schema file"),
    base_dir: Optional[str] = typer.Option(
        None, "--base-dir", "-b", help="Base directory for resolving schema paths"
    ),
) -> None:
    """Validate a file against a schema.
    
    Args:
        file_path: Path to the file to validate
        schema_path: Path to the schema file
        base_dir: Base directory for resolving schema paths
    """
    # Check if file exists
    if not os.path.exists(file_path):
        console.print(f"[bold red]Error:[/bold red] File not found: {file_path}")
        sys.exit(1)
    
    # Load file
    try:
        with open(file_path, "r") as f:
            data = yaml.safe_load(f)
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] Failed to load file: {e}")
        sys.exit(1)
    
    # Create schema loader
    loader = SchemaLoader(SchemaLoaderOptions(base_dir=base_dir))
    
    # Validate data
    try:
        valid, errors = loader.validate_against_schema(data, schema_path)
        
        if valid:
            console.print(f"[bold green]Success:[/bold green] File is valid against schema")
        else:
            console.print(f"[bold red]Error:[/bold red] File is not valid against schema")
            console.print(f"[bold red]Errors:[/bold red] {errors}")
            sys.exit(1)
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] Failed to validate file: {e}")
        sys.exit(1)


@app.command()
def create_from_template(
    template_path: str = typer.Argument(..., help="Path to the template file"),
    output_path: str = typer.Argument(..., help="Path to save the new file"),
    schema_path: Optional[str] = typer.Option(
        None, "--schema", "-s", help="Path to the schema file for validation"
    ),
    base_dir: Optional[str] = typer.Option(
        None, "--base-dir", "-b", help="Base directory for resolving schema paths"
    ),
    title: Optional[str] = typer.Option(None, "--title", "-t", help="Title for the node"),
    description: Optional[str] = typer.Option(
        None, "--description", "-d", help="Description for the node"
    ),
    user: Optional[str] = typer.Option(None, "--user", "-u", help="User creating the node"),
    validate_schema: bool = typer.Option(
        True, "--validate/--no-validate", help="Validate against schema"
    ),
) -> None:
    """Create a new file from a template.
    
    Args:
        template_path: Path to the template file
        output_path: Path to save the new file
        schema_path: Path to the schema file for validation
        base_dir: Base directory for resolving schema paths
        title: Title for the node
        description: Description for the node
        user: User creating the node
        validate_schema: Validate against schema
    """
    # Check if template exists
    if not os.path.exists(template_path):
        console.print(f"[bold red]Error:[/bold red] Template not found: {template_path}")
        sys.exit(1)
    
    # Check if output file already exists
    if os.path.exists(output_path):
        console.print(f"[bold red]Error:[/bold red] Output file already exists: {output_path}")
        sys.exit(1)
    
    # Load template
    try:
        with open(template_path, "r") as f:
            template = yaml.safe_load(f)
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] Failed to load template: {e}")
        sys.exit(1)
    
    # Get current time in ISO format
    from datetime import datetime
    now = datetime.utcnow().isoformat() + "Z"
    
    # Add one week for future date
    import datetime as dt
    future = (datetime.utcnow() + dt.timedelta(days=7)).isoformat() + "Z"
    
    # Replace placeholders
    import uuid
    import json
    
    if isinstance(template, dict):
        template_str = yaml.dump(template)
        
        # Replace placeholders
        template_str = template_str.replace("{{uuid}}", str(uuid.uuid4()))
        template_str = template_str.replace("{{now}}", now)
        template_str = template_str.replace("{{future_date}}", future)
        template_str = template_str.replace("{{user}}", user or "anonymous")
        
        if title:
            template_str = template_str.replace("{{title}}", title)
        
        if description:
            template_str = template_str.replace("{{description}}", description)
        
        # Convert back to dict
        template = yaml.safe_load(template_str)
    
    # Validate against schema if requested
    if validate_schema and schema_path:
        loader = SchemaLoader(SchemaLoaderOptions(base_dir=base_dir))
        
        try:
            valid, errors = loader.validate_against_schema(template, schema_path)
            
            if not valid:
                console.print(f"[bold red]Error:[/bold red] Template is not valid against schema")
                console.print(f"[bold red]Errors:[/bold red] {errors}")
                sys.exit(1)
        except Exception as e:
            console.print(f"[bold red]Error:[/bold red] Failed to validate template: {e}")
            sys.exit(1)
    
    # Write output file
    try:
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w") as f:
            yaml.dump(template, f, default_flow_style=False, sort_keys=False)
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] Failed to write output file: {e}")
        sys.exit(1)
    
    console.print(f"[bold green]Success:[/bold green] Created file: {output_path}")


@app.command()
def list_schemas(
    directory: str = typer.Argument(..., help="Directory containing schemas"),
    recursive: bool = typer.Option(True, "--recursive/--no-recursive", help="Search recursively"),
) -> None:
    """List available schemas in a directory.
    
    Args:
        directory: Directory containing schemas
        recursive: Search recursively
    """
    # Check if directory exists
    if not os.path.exists(directory) or not os.path.isdir(directory):
        console.print(f"[bold red]Error:[/bold red] Directory not found: {directory}")
        sys.exit(1)
    
    # Find schema files
    schemas = []
    
    if recursive:
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith((".yaml", ".yml", ".json")):
                    schemas.append(os.path.join(root, file))
    else:
        for file in os.listdir(directory):
            if file.endswith((".yaml", ".yml", ".json")) and os.path.isfile(
                os.path.join(directory, file)
            ):
                schemas.append(os.path.join(directory, file))
    
    # Create table
    table = Table(title="Available Schemas")
    table.add_column("Path", style="cyan")
    table.add_column("Type", style="green")
    
    # Add rows
    for schema_path in sorted(schemas):
        try:
            with open(schema_path, "r") as f:
                schema = yaml.safe_load(f)
            
            schema_type = "Unknown"
            
            if isinstance(schema, dict):
                if "components" in schema and "schemas" in schema["components"]:
                    schema_names = schema["components"]["schemas"].keys()
                    schema_type = ", ".join(schema_names)
            
            table.add_row(schema_path, schema_type)
        except Exception:
            table.add_row(schema_path, "Error loading schema")
    
    # Print table
    console.print(table)


if __name__ == "__main__":
    app() 