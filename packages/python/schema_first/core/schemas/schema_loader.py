"""Schema loader module for loading and validating schemas."""

import os
from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Union, cast

import yaml
import json
import jsonschema
from jsonschema import RefResolver
from pydantic import BaseModel


class SchemaLoaderOptions(BaseModel):
    """Options for the schema loader."""

    base_dir: Optional[str] = None
    dereference: bool = True


class SchemaLoader:
    """Class for loading and validating schemas."""

    def __init__(self, options: Optional[SchemaLoaderOptions] = None) -> None:
        """Initialize the schema loader.
        
        Args:
            options: Options for the schema loader
        """
        self.options = options or SchemaLoaderOptions()
        self.base_dir = Path(self.options.base_dir or os.getcwd())
        self.schemas: Dict[str, Dict[str, Any]] = {}
        self.resolver = None

    def load_schema(self, schema_path: str) -> Dict[str, Any]:
        """Load a schema from a YAML or JSON file.
        
        Args:
            schema_path: Path to the schema file (relative to base_dir)
            
        Returns:
            The loaded schema
            
        Raises:
            FileNotFoundError: If the schema file does not exist
            ValueError: If the schema file is not valid YAML or JSON
        """
        full_path = self.base_dir / schema_path
        
        if not full_path.exists():
            raise FileNotFoundError(f"Schema file not found: {full_path}")
        
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Determine file type based on extension
        if full_path.suffix.lower() in (".yaml", ".yml"):
            schema = yaml.safe_load(content)
        elif full_path.suffix.lower() == ".json":
            schema = json.loads(content)
        else:
            raise ValueError(f"Unsupported file extension: {full_path.suffix}")
        
        if not isinstance(schema, dict):
            raise ValueError(f"Schema must be a dictionary: {schema_path}")
        
        # Store schema
        self.schemas[schema_path] = schema
        
        # Create resolver for this schema
        schema_uri = f"file://{full_path.absolute()}"
        self.resolver = RefResolver(schema_uri, schema)
        
        return schema

    def convert_to_json_schema(self, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Convert a schema to JSON Schema format.
        
        Args:
            schema: The schema to convert
            
        Returns:
            The converted schema
            
        Raises:
            ValueError: If the schema is not valid
        """
        if not schema or not isinstance(schema, dict):
            raise ValueError("Invalid schema")
        
        # For OpenAPI schemas, extract the actual schema
        if "components" in schema and "schemas" in schema["components"]:
            components = cast(Dict[str, Any], schema["components"])
            schemas = cast(Dict[str, Any], components["schemas"])
            schema_name = next(iter(schemas))
            return cast(Dict[str, Any], schemas[schema_name])
        
        return schema

    def validate_against_schema(
        self, data: Any, schema_path: str
    ) -> Tuple[bool, Optional[list]]:
        """Validate data against a schema.
        
        Args:
            data: The data to validate
            schema_path: Path to the schema file
            
        Returns:
            A tuple of (valid, errors)
            
        Raises:
            ValueError: If the schema is not found
        """
        # Load schema if not already loaded
        if schema_path not in self.schemas:
            self.load_schema(schema_path)
        
        schema = self.schemas.get(schema_path)
        if not schema:
            raise ValueError(f"Schema not found: {schema_path}")
        
        json_schema = self.convert_to_json_schema(schema)
        
        # Validate data
        try:
            jsonschema.validate(instance=data, schema=json_schema, resolver=self.resolver)
            return True, None
        except jsonschema.exceptions.ValidationError as e:
            return False, e.args

    def get_schema(self, schema_path: str) -> Optional[Dict[str, Any]]:
        """Get a loaded schema.
        
        Args:
            schema_path: Path to the schema file
            
        Returns:
            The schema or None if not loaded
        """
        return self.schemas.get(schema_path)

    def clear_schemas(self) -> None:
        """Clear all loaded schemas."""
        self.schemas.clear()
        self.resolver = None 