"""Schema server FastAPI application."""

import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional, Union

import yaml
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from schema_first.core.schemas import SchemaLoader, SchemaLoaderOptions


class SchemaInfo(BaseModel):
    """Information about a schema."""

    path: str = Field(..., description="Path to the schema file")
    type: str = Field(..., description="Type of schema")
    title: Optional[str] = Field(None, description="Title of the schema")
    version: Optional[str] = Field(None, description="Version of the schema")
    description: Optional[str] = Field(None, description="Description of the schema")


class SchemaList(BaseModel):
    """List of schemas."""

    schemas: List[SchemaInfo] = Field(..., description="List of schemas")


# Create the FastAPI app
app = FastAPI(
    title="Schema Server",
    description="Schema server for serving schemas and supporting fast development iterations",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schema loader
schema_loader = SchemaLoader()
# Schema directory (configurable)
schema_dir = os.environ.get("SCHEMA_DIR", "./schemas")


@app.get("/", response_model=Dict[str, str])
async def root() -> Dict[str, str]:
    """Get server info.
    
    Returns:
        Server information
    """
    return {
        "name": "Schema Server",
        "version": "0.1.0",
        "description": "Schema server for serving schemas and supporting fast development iterations",
    }


@app.get("/schemas", response_model=SchemaList)
async def list_schemas(
    directory: Optional[str] = Query(None, description="Directory to search for schemas"),
    recursive: bool = Query(True, description="Search recursively"),
) -> SchemaList:
    """List available schemas.
    
    Args:
        directory: Directory to search for schemas
        recursive: Search recursively
        
    Returns:
        List of available schemas
    """
    search_dir = directory or schema_dir
    
    # Check if directory exists
    if not os.path.exists(search_dir) or not os.path.isdir(search_dir):
        raise HTTPException(status_code=404, detail=f"Directory not found: {search_dir}")
    
    # Find schema files
    schemas = []
    
    if recursive:
        for root, _, files in os.walk(search_dir):
            for file in files:
                if file.endswith((".yaml", ".yml", ".json")):
                    schemas.append(os.path.join(root, file))
    else:
        for file in os.listdir(search_dir):
            if file.endswith((".yaml", ".yml", ".json")) and os.path.isfile(
                os.path.join(search_dir, file)
            ):
                schemas.append(os.path.join(search_dir, file))
    
    # Get schema info
    schema_infos = []
    
    for schema_path in sorted(schemas):
        try:
            with open(schema_path, "r") as f:
                if schema_path.endswith((".yaml", ".yml")):
                    schema = yaml.safe_load(f)
                else:
                    schema = json.load(f)
            
            schema_type = "Unknown"
            title = None
            version = None
            description = None
            
            if isinstance(schema, dict):
                # Try to get info from OpenAPI schema
                if "info" in schema:
                    info = schema["info"]
                    title = info.get("title")
                    version = info.get("version")
                    description = info.get("description")
                
                # Try to get schema type
                if "components" in schema and "schemas" in schema["components"]:
                    schema_names = schema["components"]["schemas"].keys()
                    schema_type = ", ".join(schema_names)
            
            schema_infos.append(
                SchemaInfo(
                    path=schema_path,
                    type=schema_type,
                    title=title,
                    version=version,
                    description=description,
                )
            )
        except Exception as e:
            # Skip invalid schemas
            continue
    
    return SchemaList(schemas=schema_infos)


@app.get("/schemas/{schema_path:path}")
async def get_schema(
    schema_path: str,
    format: str = Query("yaml", description="Format to return the schema in (yaml or json)"),
) -> Union[Dict[str, Any], str]:
    """Get a schema by path.
    
    Args:
        schema_path: Path to the schema file
        format: Format to return the schema in (yaml or json)
        
    Returns:
        The schema
    """
    # Construct absolute path
    abs_path = os.path.join(schema_dir, schema_path)
    
    # Check if file exists
    if not os.path.exists(abs_path) or not os.path.isfile(abs_path):
        raise HTTPException(status_code=404, detail=f"Schema not found: {schema_path}")
    
    # Load schema
    try:
        with open(abs_path, "r") as f:
            if abs_path.endswith((".yaml", ".yml")):
                schema = yaml.safe_load(f)
            else:
                schema = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load schema: {e}")
    
    # Return in requested format
    if format.lower() == "json":
        return schema
    elif format.lower() == "yaml":
        return yaml.dump(schema, default_flow_style=False)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")


@app.post("/validate")
async def validate_against_schema(
    data: Dict[str, Any], schema_path: str = Query(..., description="Path to the schema file")
) -> Dict[str, Any]:
    """Validate data against a schema.
    
    Args:
        data: The data to validate
        schema_path: Path to the schema file
        
    Returns:
        Validation result
    """
    # Check if schema file exists
    abs_path = os.path.join(schema_dir, schema_path)
    
    if not os.path.exists(abs_path) or not os.path.isfile(abs_path):
        raise HTTPException(status_code=404, detail=f"Schema not found: {schema_path}")
    
    # Validate data
    try:
        valid, errors = schema_loader.validate_against_schema(data, abs_path)
        
        return {
            "valid": valid,
            "errors": errors,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to validate data: {e}")


def start_server(
    host: str = "127.0.0.1", port: int = 8000, schema_directory: Optional[str] = None
) -> None:
    """Start the schema server.
    
    Args:
        host: Host to bind to
        port: Port to bind to
        schema_directory: Directory containing schemas
    """
    # Set schema directory if provided
    global schema_dir
    if schema_directory:
        schema_dir = schema_directory
    
    # Start server
    uvicorn.run(app, host=host, port=port) 