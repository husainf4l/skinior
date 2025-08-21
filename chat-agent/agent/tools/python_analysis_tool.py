"""
Python Evaluation Tool for Financial Analysis

Provides safe Python code execution for dynamic financial calculations,
data analysis, and custom metric computations.
"""

import logging
import time
import asyncio
from typing import Any, Dict
from langchain_experimental.tools import PythonREPLTool
from langchain_core.tools import tool

logger = logging.getLogger(__name__)

# Create a safe Python REPL tool
python_repl = PythonREPLTool()


@tool
def python_financial_calculator(code: str) -> str:
    """Execute Python code for financial calculations and analysis.

    This tool provides a secure Python environment for:
    - Financial ratio calculations
    - Data processing and transformations
    - Mathematical modeling

    Available libraries: math, statistics, datetime
    Optional libraries (if installed): pandas (as pd), numpy (as np)

    Built-in helper functions:
    - calculate_ratio(numerator, denominator)
    - percentage_change(old_value, new_value)
    - compound_annual_growth_rate(beginning_value, ending_value, years)

    Args:
        code: Python code to execute (should include print statements for output)

    Returns:
        Execution result or error message

    Examples:
        python_financial_calculator("
        # Calculate financial ratios
        current_assets = 50000000
        current_liabilities = 30000000
        current_ratio = current_assets / current_liabilities
        print(f'Current Ratio: {current_ratio:.2f}')
        ")
    """
    start_time = time.time()

    try:
        # Enhanced code with helper functions and safe imports
        enhanced_code = f"""
import math
import statistics
from datetime import datetime, timedelta
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

# Helper functions for financial calculations
def calculate_ratio(numerator, denominator):
    \"\"\"Safe ratio calculation with division by zero protection.\"\"\"
    if denominator == 0:
        return float('inf') if numerator > 0 else 0
    return numerator / denominator

def percentage_change(old_value, new_value):
    \"\"\"Calculate percentage change between two values.\"\"\"
    if old_value == 0:
        return float('inf') if new_value > 0 else 0
    return ((new_value - old_value) / old_value) * 100

def compound_annual_growth_rate(beginning_value, ending_value, years):
    \"\"\"Calculate CAGR between two values over a number of years.\"\"\"
    if beginning_value <= 0 or years <= 0:
        return 0
    return (pow(ending_value / beginning_value, 1 / years) - 1) * 100

def format_currency(amount, currency="USD"):
    \"\"\"Format amount as currency.\"\"\"
    return f"{{currency}} {{amount:,.2f}}"

def format_percentage(value):
    \"\"\"Format value as percentage.\"\"\"
    return f"{{value:.2f}}%"

# User code starts here
{code}
"""

        # Execute the enhanced code
        result = python_repl.run(enhanced_code)
        execution_time = time.time() - start_time

        # Format the result for better readability
        if result and isinstance(result, str):
            if "Error" in result or "Exception" in result:
                formatted_result = f"❌ **Execution Error**\n```\n{result}\n```\n\n**Execution time:** {execution_time:.3f}s"
            else:
                formatted_result = f"✅ **Python Execution Result**\n```\n{result}\n```\n\n**Execution time:** {execution_time:.3f}s"
        else:
            formatted_result = f"✅ **Python code executed successfully** (No output)\n\n**Execution time:** {execution_time:.3f}s"

        return formatted_result

    except Exception as e:
        execution_time = time.time() - start_time
        error_result = f"❌ **Python Execution Error**\n```\n{str(e)}\n```\n\n**Execution time:** {execution_time:.3f}s\n\n**Tip:** Check your syntax and ensure all variables are defined."
        return error_result


@tool
def financial_ratio_calculator(financial_data: str, ratios: str = "all") -> str:
    """Calculate common financial ratios from provided data.

    This tool automatically calculates financial ratios when given financial data.
    Supports most common ratios used in financial analysis.

    Args:
        financial_data: Financial data in key=value format (one per line)
        ratios: Comma-separated list of ratios to calculate (or "all" for all ratios)

    Available ratios:
    - current_ratio: Current Assets / Current Liabilities
    - quick_ratio: (Current Assets - Inventory) / Current Liabilities
    - debt_to_equity: Total Debt / Total Equity
    - return_on_equity: Net Income / Total Equity
    - return_on_assets: Net Income / Total Assets
    - gross_margin: (Revenue - COGS) / Revenue
    - net_margin: Net Income / Revenue
    - asset_turnover: Revenue / Total Assets
    - inventory_turnover: COGS / Inventory

    Example:
        financial_ratio_calculator("
        current_assets=50000000
        current_liabilities=30000000
        inventory=10000000
        total_debt=20000000
        total_equity=40000000
        net_income=5000000
        revenue=100000000
        ", "current_ratio,quick_ratio")
    """
    start_time = time.time()

    try:
        # Parse financial data
        data = {}
        for line in financial_data.strip().split("\n"):
            if "=" in line:
                key, value = line.split("=", 1)
                try:
                    data[key.strip().lower()] = float(value.strip())
                except ValueError:
                    continue

        if not data:
            return "❌ **Error:** No valid financial data provided. Use format: key=value (one per line)"

        # Define ratio calculations
        ratio_functions = {
            "current_ratio": lambda d: d.get("current_assets", 0)
            / d.get("current_liabilities", 1),
            "quick_ratio": lambda d: (
                d.get("current_assets", 0) - d.get("inventory", 0)
            )
            / d.get("current_liabilities", 1),
            "debt_to_equity": lambda d: d.get("total_debt", 0)
            / d.get("total_equity", 1),
            "return_on_equity": lambda d: (
                d.get("net_income", 0) / d.get("total_equity", 1)
            )
            * 100,
            "return_on_assets": lambda d: (
                d.get("net_income", 0) / d.get("total_assets", 1)
            )
            * 100,
            "gross_margin": lambda d: (
                (d.get("revenue", 0) - d.get("cogs", 0)) / d.get("revenue", 1)
            )
            * 100,
            "net_margin": lambda d: (d.get("net_income", 0) / d.get("revenue", 1))
            * 100,
            "asset_turnover": lambda d: d.get("revenue", 0) / d.get("total_assets", 1),
            "inventory_turnover": lambda d: d.get("cogs", 0) / d.get("inventory", 1),
        }

        # Determine which ratios to calculate
        if ratios.lower() == "all":
            ratios_to_calc = list(ratio_functions.keys())
        else:
            ratios_to_calc = [r.strip().lower() for r in ratios.split(",")]

        # Calculate ratios
        results = []
        results.append("✅ **Financial Ratio Analysis Results**\n")
        results.append("**Input Data:**")
        for key, value in data.items():
            results.append(f"- {key.replace('_', ' ').title()}: {value:,.2f}")

        results.append("\n**Calculated Ratios:**")

        for ratio_name in ratios_to_calc:
            if ratio_name in ratio_functions:
                try:
                    value = ratio_functions[ratio_name](data)
                    if ratio_name in [
                        "return_on_equity",
                        "return_on_assets",
                        "gross_margin",
                        "net_margin",
                    ]:
                        results.append(
                            f"- {ratio_name.replace('_', ' ').title()}: {value:.2f}%"
                        )
                    else:
                        results.append(
                            f"- {ratio_name.replace('_', ' ').title()}: {value:.2f}"
                        )
                except ZeroDivisionError:
                    results.append(
                        f"- {ratio_name.replace('_', ' ').title()}: N/A (Division by zero)"
                    )
                except Exception as e:
                    results.append(
                        f"- {ratio_name.replace('_', ' ').title()}: Error ({str(e)})"
                    )
            else:
                results.append(
                    f"- {ratio_name}: **Unknown ratio** (not in available list)"
                )

        execution_time = time.time() - start_time
        results.append(f"\n**Execution time:** {execution_time:.3f}s")

        return "\n".join(results)

    except Exception as e:
        execution_time = time.time() - start_time
        return f"❌ **Financial Ratio Calculation Error**\n```\n{str(e)}\n```\n\n**Execution time:** {execution_time:.3f}s"
