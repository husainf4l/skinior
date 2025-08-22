"""
Financial Analysis Tools for Balsan Agent Service

These tools integrate with the main Balsan Admin API to provide
income statement analysis and balance sheet reporting capabilities
to the AI agent.

Uses system user authentication for secure API access without hardcoded tokens.
"""

import logging
import time
import asyncio
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from langchain_core.tools import tool
from .system_auth import sync_system_authenticated_request

logger = logging.getLogger(__name__)


@tool
def get_balance_sheet(
    as_of_date: str = None,
    companies: str = None,
    include_details: bool = False,
) -> str:
    """
    Generate balance sheet summary showing assets, liabilities, and equity.

    Returns key balance sheet metrics: Total Assets, Current Assets, Liabilities,
    Equity, and financial ratios like Current Ratio and Debt-to-Equity.

    Args:
        as_of_date: Date for balance sheet (YYYY-MM-DD). Defaults to today
        companies: Company codes (e.g., "BLS,BJO"). Leave empty for all
        include_details: Include detailed breakdown in response

    Returns:
        Concise balance sheet summary

    Examples:
        get_balance_sheet("2025-06-30", "BLS,BJO", True)
    """

    # Set default date if not provided
    if not as_of_date:
        as_of_date = date.today().strftime("%Y-%m-%d")

    # Prepare API payload according to the correct format
    payload = {
        "as_of_date": as_of_date,
        "include_details": include_details,
    }

    if companies:
        # Convert comma-separated string to list format for the API
        company_list = [c.strip().upper() for c in companies.split(",")]
        payload["companies"] = company_list

    # Make authenticated API call using the agent finance endpoint
    result = sync_system_authenticated_request(
        "/api/agent/finance/balance-sheet", method="POST", json_data=payload
    )

    if "error" in result:
        return f"❌ Error generating balance sheet: {result['error']}"

    if not result or result.get("status") == "error":
        return f"❌ {result.get('message', 'Failed to generate balance sheet')}"

    # Format the response based on API response structure
    if result.get("status") != "success":
        return f"❌ {result.get('message', 'Failed to generate balance sheet')}"

    # Use the actual API response structure
    summary = result.get("summary", {})
    date_range = result.get("date_range", {})
    companies_data = result.get("data", [])

    # Extract values using the correct field names from API
    total_assets = summary.get("total_assets", 0)
    current_assets = summary.get("total_current_assets", 0)
    total_cash = summary.get("total_cash", 0) + summary.get("total_cash_equivalents", 0)
    accounts_receivable = summary.get("total_accounts_receivable", 0)
    inventory = summary.get("total_inventory", 0)

    total_liabilities = summary.get("total_liabilities", 0)
    current_liabilities = summary.get("total_current_liabilities", 0)
    total_equity = summary.get("total_equity", 0)

    # Calculate key ratios from company data if available
    current_ratio = 0
    debt_to_equity = 0
    if companies_data:
        # Use the first company's ratios or consolidated data
        company_data = companies_data[0]
        current_ratio = company_data.get("current_ratio", 0)
        debt_to_equity = company_data.get("debt_to_equity_ratio", 0)

    # Build concise summary
    as_of_date_display = date_range.get("as_of_date", as_of_date)

    response = f"Balance Sheet (as of {as_of_date_display}): "
    response += f"Total Assets ${total_assets:,.0f} | "
    response += f"Current Assets ${current_assets:,.0f} (Cash ${total_cash:,.0f}, A/R ${accounts_receivable:,.0f}, Inventory ${inventory:,.0f}) | "
    response += f"Total Liabilities ${total_liabilities:,.0f} | "
    response += f"Total Equity ${total_equity:,.0f} | "
    response += f"Current Ratio {current_ratio:.2f} | "
    response += f"Debt/Equity {debt_to_equity:.2f}"

    # Add company count if multiple companies
    total_companies = result.get("total_companies", 0)
    if total_companies > 1:
        response += f" | {total_companies} companies"

    return response


@tool
def get_income_statement(
    start_date: str = None,
    end_date: str = None,
    companies: str = None,
    include_details: bool = False,
) -> str:
    """
    Generate concise Income Statement summary using the correct agent finance API.

    Returns key P&L metrics: Revenue, COGS, Gross Profit, Expenses, Net Income, Profit Margin.

    Args:
        start_date: Start date (YYYY-MM-DD). Defaults to current year start
        end_date: End date (YYYY-MM-DD). Defaults to today
        companies: Company codes (e.g., "BLS,BJO"). Leave empty for all
        include_details: Include detailed breakdown in response

    Returns:
        Concise income statement summary

    Examples:
        get_income_statement("2025-01-01", "2025-06-30", "BLS,BJO", True)
    """

    # Set default dates if not provided
    current_year = date.today().year
    if not start_date:
        start_date = f"{current_year}-01-01"
    if not end_date:
        end_date = date.today().strftime("%Y-%m-%d")

    # Prepare API payload according to the correct format
    payload = {
        "start_date": start_date,
        "end_date": end_date,
        "include_details": include_details,
    }

    if companies:
        # Convert comma-separated string to list format for the API
        company_list = [c.strip().upper() for c in companies.split(",")]
        payload["companies"] = company_list

    # Make authenticated API call using the correct agent finance endpoint
    result = sync_system_authenticated_request(
        "/api/agent/finance/income-statement", method="POST", json_data=payload
    )

    if "error" in result:
        return f"❌ Error generating income statement: {result['error']}"

    if not result or result.get("status") == "error":
        return f"❌ {result.get('message', 'Failed to generate income statement')}"

    # Format the response based on ACTUAL API response structure
    if result.get("status") != "success":
        return f"❌ {result.get('message', 'Failed to generate income statement')}"

    # Use the actual API response structure from testing
    summary = result.get("summary", {})
    date_range = result.get("date_range", {})
    companies_data = result.get("data", [])

    # Extract values using the correct field names from API response
    revenue = summary.get("total_revenue", 0)
    cogs = summary.get("cost_of_goods", 0)
    gross_profit = summary.get("gross_profit", 0)
    gross_margin = summary.get("gross_profit_margin", 0)
    expenses = summary.get("total_expenses", 0)
    net_income = summary.get("net_income", 0)
    net_margin = summary.get("net_profit_margin", 0)

    # Build response based on include_details parameter
    start_date_display = date_range.get("start_date", start_date)
    end_date_display = date_range.get("end_date", end_date)

    if include_details:
        # Detailed response with breakdowns
        response = f"📊 **Detailed Income Statement ({start_date_display} to {end_date_display})**\n\n"

        # Summary section
        response += f"**📈 Summary:**\n"
        response += f"• Total Revenue: ${revenue:,.2f}\n"
        response += f"• Cost of Goods Sold: ${cogs:,.2f}\n"
        response += (
            f"• Gross Profit: ${gross_profit:,.2f} ({gross_margin:.1f}% margin)\n"
        )
        response += f"• Total Expenses: ${expenses:,.2f}\n"
        response += f"• Net Income: ${net_income:,.2f} ({net_margin:.1f}% margin)\n\n"

        # Add company-specific details if available
        if companies_data and len(companies_data) > 0:
            response += f"**🏢 Company Breakdown:**\n"
            for company in companies_data:
                company_code = company.get("company", "Unknown")
                company_revenue = company.get("sales_revenue", 0)
                company_net = company.get("total_comprehensive_income", 0)
                company_margin = company.get("net_profit_margin_percentage", 0)

                response += f"• {company_code}: "
                response += f"Revenue ${company_revenue:,.2f}, "
                response += (
                    f"Net Income ${company_net:,.2f} ({company_margin:.1f}% margin)\n"
                )
            response += "\n"

        # Add detailed expense breakdown from company data if available
        if companies_data and len(companies_data) > 0:
            response += f"**💰 Expense Breakdown (Consolidated):**\n"

            # Aggregate expense categories across all companies
            total_general_admin = sum(
                company.get("general_admin_expenses", 0) for company in companies_data
            )
            total_sales_expenses = sum(
                company.get("sales_expenses", 0) for company in companies_data
            )
            total_marketing = sum(
                company.get("marketing_expenses", 0) for company in companies_data
            )
            total_dealer_incentives = sum(
                company.get("dealer_incentives", 0) for company in companies_data
            )
            total_depreciation = sum(
                company.get("depreciation_expenses", 0) for company in companies_data
            )
            total_other_comprehensive = sum(
                company.get("other_comprehensive", 0) for company in companies_data
            )

            if total_general_admin > 0:
                response += f"• General & Administrative: ${total_general_admin:,.2f}\n"
            if total_sales_expenses > 0:
                response += f"• Sales Expenses: ${total_sales_expenses:,.2f}\n"
            if total_marketing > 0:
                response += f"• Marketing Expenses: ${total_marketing:,.2f}\n"
            if total_dealer_incentives > 0:
                response += f"• Dealer Incentives: ${total_dealer_incentives:,.2f}\n"
            if total_depreciation > 0:
                response += f"• Depreciation: ${total_depreciation:,.2f}\n"
            if total_other_comprehensive != 0:
                response += (
                    f"• Other Comprehensive: ${total_other_comprehensive:,.2f}\n"
                )

            response += "\n"

        # Add total companies info
        total_companies = result.get("total_companies", 0)
        if total_companies > 1:
            response += (
                f"**ℹ️ Coverage:** {total_companies} companies included in this analysis"
            )

    else:
        # Concise summary (original format)
        response = f"Income Statement ({start_date_display} to {end_date_display}): "
        response += f"Revenue ${revenue:,.0f}, "
        response += f"COGS ${cogs:,.0f}, "
        response += f"Gross Profit ${gross_profit:,.0f} ({gross_margin:.1f}%), "
        response += f"Expenses ${expenses:,.0f}, "
        response += f"Net Income ${net_income:,.0f} ({net_margin:.1f}% margin)"

        # Add company count if multiple companies
        total_companies = result.get("total_companies", 0)
        if total_companies > 1:
            response += f" | {total_companies} companies"

    return response


@tool
def analyze_financial_performance(
    companies: str = None,
    period: str = "current_year",
    focus_areas: str = "profitability,liquidity",
) -> str:
    """
    Comprehensive financial performance analysis using existing balance sheet and income statement data.

    Combines multiple financial metrics to provide business insights and recommendations.

    Args:
        companies: Company codes (e.g., "BLS,BJO"). Leave empty for all
        period: Analysis period - "current_year", "ytd", or specific dates
        focus_areas: Comma-separated areas - "profitability,liquidity,efficiency,leverage"

    Returns:
        Comprehensive financial analysis with insights and recommendations
    """

    start_time = time.time()
    success = False

    try:
        # Set date range based on period
        current_year = date.today().year
        if period == "current_year":
            start_date = f"{current_year}-01-01"
            end_date = date.today().strftime("%Y-%m-%d")
            as_of_date = end_date
        elif period == "ytd":
            start_date = f"{current_year}-01-01"
            end_date = date.today().strftime("%Y-%m-%d")
            as_of_date = end_date
        else:
            # Default to current year
            start_date = f"{current_year}-01-01"
            end_date = date.today().strftime("%Y-%m-%d")
            as_of_date = end_date

        # Get balance sheet data
        balance_sheet_result = get_balance_sheet(
            as_of_date=as_of_date, companies=companies, include_details=True
        )

        # Get income statement data
        income_statement_result = get_income_statement(
            start_date=start_date,
            end_date=end_date,
            companies=companies,
            include_details=True,
        )

        # Check if both tools succeeded
        if "❌" in balance_sheet_result or "❌" in income_statement_result:
            return f"❌ Error in financial analysis: Unable to retrieve complete financial data"

        # Parse focus areas
        focus_list = [area.strip().lower() for area in focus_areas.split(",")]

        # Build comprehensive analysis
        analysis = f"📊 **Financial Performance Analysis** ({period.replace('_', ' ').title()})\n\n"

        analysis += "**Key Financial Position:**\n"
        analysis += f"• {balance_sheet_result}\n"
        analysis += f"• {income_statement_result}\n\n"

        # Add focus area insights
        if "profitability" in focus_list:
            analysis += "**Profitability Analysis:**\n"
            analysis += (
                "• Revenue growth and margin trends indicate business performance\n"
            )
            analysis += "• Monitor gross margin consistency across periods\n"
            analysis += "• Operating efficiency reflected in net profit margins\n\n"

        if "liquidity" in focus_list:
            analysis += "**Liquidity Assessment:**\n"
            analysis += "• Current ratio indicates short-term debt coverage ability\n"
            analysis += "• Cash position shows operational flexibility\n"
            analysis += "• Working capital management affects cash flow\n\n"

        if "efficiency" in focus_list:
            analysis += "**Operational Efficiency:**\n"
            analysis += (
                "• Asset turnover indicates resource utilization effectiveness\n"
            )
            analysis += "• Inventory management impacts working capital\n"
            analysis += "• Receivables collection affects cash conversion\n\n"

        if "leverage" in focus_list:
            analysis += "**Financial Leverage:**\n"
            analysis += "• Debt-to-equity ratio shows financial structure balance\n"
            analysis += "• Interest coverage indicates debt servicing capacity\n"
            analysis += "• Capital structure optimization opportunities\n\n"

        # Add recommendations
        analysis += "**Strategic Recommendations:**\n"
        analysis += "• Focus on improving cash flow management\n"
        analysis += "• Monitor key ratios for early warning indicators\n"
        analysis += "• Consider industry benchmarking for performance comparison\n"
        analysis += "• Implement regular financial health monitoring\n"

        success = True
        execution_time = time.time() - start_time

        return analysis

    except Exception as e:
        execution_time = time.time() - start_time
        return f"❌ Error in financial performance analysis: {str(e)}"


@tool
def get_monthly_sales_trends(
    start_year: int = None,
    start_month: int = None,
    end_year: int = None,
    end_month: int = None,
    companies: str = None,
    include_growth_rates: bool = True,
    include_quarterly_summary: bool = True,
) -> str:
    """
    Get comprehensive monthly sales trends and financial analytics.

    Provides detailed revenue trends, profitability metrics, and company
    performance data with growth calculations and quarterly summaries.

    Args:
        start_year: Starting year for analysis (default: current year - 1)
        start_month: Starting month 1-12 (default: 1)
        end_year: Ending year for analysis (default: current year)
        end_month: Ending month 1-12 (default: current month)
        companies: Company codes (e.g., "ALBALSANCO"). Leave empty for all
        include_growth_rates: Include month-over-month and year-over-year growth
        include_quarterly_summary: Include quarterly aggregated data

    Returns:
        Comprehensive sales trends analysis with key metrics

    Examples:
        get_monthly_sales_trends(2024, 1, 2025, 8, "ALBALSANCO", True, True)
    """

    try:
        start_time = time.time()

        # Set defaults
        current_date = datetime.now()
        if not start_year:
            start_year = current_date.year - 1
        if not start_month:
            start_month = 1
        if not end_year:
            end_year = current_date.year
        if not end_month:
            end_month = current_date.month

        # Prepare API payload
        payload = {
            "start_year": start_year,
            "start_month": start_month,
            "end_year": end_year,
            "end_month": end_month,
            "include_growth_rates": include_growth_rates,
            "include_quarterly_summary": include_quarterly_summary,
        }

        if companies:
            # Convert comma-separated string to list format for the API
            company_list = [c.strip().upper() for c in companies.split(",")]
            payload["companies"] = company_list

        # Make authenticated API call
        result = sync_system_authenticated_request(
            "/api/agent/finance/trends", method="POST", json_data=payload
        )

        if "error" in result:
            return f"❌ Error generating sales trends: {result['error']}"

        if not result or result.get("status") == "error":
            return f"❌ {result.get('message', 'Failed to generate sales trends')}"

        if result.get("status") != "success":
            return f"❌ {result.get('message', 'Failed to generate sales trends')}"

        # Extract key data from response
        overall_summary = result.get("overall_summary", {})
        kpi_metrics = result.get("kpi_metrics", {})
        market_insights = result.get("market_insights", {})
        period = result.get("period", {})

        # Build comprehensive summary
        response = f"📈 **Monthly Sales Trends** ({period.get('start_date', start_year)}-{period.get('start_month', start_month)} to {period.get('end_date', end_year)}-{period.get('end_month', end_month)})\n\n"

        # Overall performance metrics
        total_sales = overall_summary.get("total_sales", 0)
        total_net_profit = overall_summary.get("total_net_profit", 0)
        net_margin = overall_summary.get("overall_net_margin_percentage", 0)
        months_analyzed = overall_summary.get("number_of_months", 0)
        avg_monthly_sales = overall_summary.get("average_monthly_sales", 0)

        response += f"**📊 Overall Performance ({months_analyzed} months):**\n"
        response += f"• Total Sales: ${total_sales:,.0f}\n"
        response += (
            f"• Total Net Profit: ${total_net_profit:,.0f} ({net_margin:.1f}% margin)\n"
        )
        response += f"• Average Monthly Sales: ${avg_monthly_sales:,.0f}\n"
        response += f"• Gross Margin: {overall_summary.get('overall_gross_margin_percentage', 0):.1f}%\n"
        response += f"• Operating Margin: {overall_summary.get('overall_operating_margin_percentage', 0):.1f}%\n\n"

        # Key performance indicators
        response += "**📈 Key Performance Indicators:**\n"
        response += (
            f"• Revenue Growth Rate: {kpi_metrics.get('revenue_growth_rate', 0):.1f}%\n"
        )
        response += f"• Net Profit Growth Rate: {kpi_metrics.get('net_profit_growth_rate', 0):.1f}%\n"
        response += f"• Profitability Trend Score: {kpi_metrics.get('profitability_trend_score', 0):.1f}\n"
        response += f"• Revenue Consistency Score: {kpi_metrics.get('revenue_consistency_score', 0):.1f}\n"
        response += f"• Growth Momentum Score: {kpi_metrics.get('growth_momentum_score', 0):.1f}\n\n"

        # Market insights
        response += "**🎯 Market Insights:**\n"
        response += f"• Peak Sales Month: {market_insights.get('peak_sales_month', 'N/A')} (${market_insights.get('peak_sales_amount', 0):,.0f})\n"
        response += f"• Lowest Sales Month: {market_insights.get('lowest_sales_month', 'N/A')} (${market_insights.get('lowest_sales_amount', 0):,.0f})\n"
        response += f"• Profitable Months: {market_insights.get('profitable_months_count', 0)} of {months_analyzed} ({market_insights.get('profitability_ratio', 0):.1f}%)\n"
        response += (
            f"• Revenue Volatility: {kpi_metrics.get('margin_volatility', 0):.1f}%\n"
        )
        response += f"• Seasonal Variation: {market_insights.get('seasonal_variation_coefficient', 0):.3f}\n\n"

        # Extract and display detailed monthly data
        monthly_data = result.get("monthly_data", [])
        monthly_trends = result.get("monthly_trends", [])
        monthly_breakdown = result.get("monthly_breakdown", [])

        # Try to find monthly data in any of these possible fields
        detailed_monthly = monthly_data or monthly_trends or monthly_breakdown

        if detailed_monthly:
            response += "**📅 Detailed Monthly Breakdown:**\n\n"
            response += "| Month | Total Sales | Net Profit | Margin % | Growth % |\n"
            response += "|-------|-------------|------------|----------|----------|\n"

            for month_data in detailed_monthly:
                month_name = month_data.get("month", month_data.get("period", "N/A"))
                month_sales = month_data.get(
                    "total_sales", month_data.get("sales", month_data.get("revenue", 0))
                )
                month_profit = month_data.get("net_profit", month_data.get("profit", 0))
                month_margin = month_data.get(
                    "net_margin_percentage", month_data.get("margin", 0)
                )
                month_growth = month_data.get(
                    "growth_rate", month_data.get("mom_growth", 0)
                )

                response += f"| {month_name} | ${month_sales:,.0f} | ${month_profit:,.0f} | {month_margin:.1f}% | {month_growth:+.1f}% |\n"

            response += "\n"

        # Company performance (if multiple companies)
        company_performance = result.get("company_performance", [])
        if len(company_performance) > 1:
            response += "**🏢 Company Performance:**\n"
            for company in company_performance[:5]:  # Show top 5 companies
                company_name = company.get("company", "Unknown")
                revenue = company.get("total_revenue", 0)
                market_share = company.get("market_share", 0)
                growth_rate = company.get("growth_rate", 0)
                response += f"• {company_name}: ${revenue:,.0f} ({market_share:.1f}% market share, {growth_rate:+.1f}% growth)\n"
            response += "\n"

        # If no detailed monthly data found, let's inspect what's actually in the result
        if not detailed_monthly:
            response += "**🔍 Available API Response Fields (for debugging):**\n"
            for key in result.keys():
                if key not in [
                    "overall_summary",
                    "kpi_metrics",
                    "market_insights",
                    "period",
                    "company_performance",
                ]:
                    data_type = type(result[key]).__name__
                    data_preview = (
                        str(result[key])[:100] + "..."
                        if len(str(result[key])) > 100
                        else str(result[key])
                    )
                    response += f"• {key} ({data_type}): {data_preview}\n"
            response += "\n"

        # Add execution time
        execution_time = time.time() - start_time
        response += f"⏱️ Analysis completed in {execution_time:.2f} seconds"

        return response

    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"Error in monthly sales trends analysis: {str(e)}")
        return f"❌ Error in monthly sales trends analysis: {str(e)}"


@tool
def search_accounts(
    account_name: str,
    companies: str = None,
    account_type: str = None,
) -> str:
    """
    Search for accounts by name across companies.

    Find specific accounts like "Capital Bank", "Cash", "Accounts Receivable", etc.
    Useful for finding the exact account names before checking balances.

    Args:
        account_name: Account name to search for (e.g., "Capital Bank", "Cash")
        companies: Company codes (e.g., "BLS,BJO"). Leave empty for all companies
        account_type: Filter by account type (e.g., "Asset", "Liability", "Equity")

    Returns:
        List of matching accounts with details

    Examples:
        search_accounts("Capital Bank", "BLS")
        search_accounts("Cash", "BLS,BJO")
    """

    try:
        start_time = time.time()

        # Prepare API payload
        payload = {
            "account_name": account_name,
            "limit": 20,  # Get more results for better matching
        }

        if companies:
            # Convert comma-separated string to list format for the API
            company_list = [c.strip().upper() for c in companies.split(",")]
            payload["companies"] = company_list

        if account_type:
            payload["account_type"] = account_type

        # Make authenticated API call
        result = sync_system_authenticated_request(
            "/api/agent/finance/accounts/search", method="POST", json_data=payload
        )

        if "error" in result:
            return f"❌ Error searching accounts: {result['error']}"

        if not result or result.get("status") == "error":
            return f"❌ {result.get('message', 'Failed to search accounts')}"

        if result.get("status") != "success":
            return f"❌ {result.get('message', 'Failed to search accounts')}"

        # Extract results
        accounts = result.get("accounts", [])
        total_found = result.get("total_found", 0)

        if total_found == 0:
            return f"🔍 No accounts found matching '{account_name}'"

        # Build response
        response = f"🔍 **Account Search Results** (Found {total_found} matches for '{account_name}')\n\n"

        for account in accounts[:10]:  # Show top 10 results
            # Use the correct field names from the actual API response
            main_account_rec_id = account.get("main_account_rec_id", "N/A")
            account_name = account.get("name", "N/A")
            account_type = account.get("account_type", "N/A")
            category = account.get("category", "")
            category_description = account.get("category_description", "")

            response += f"**{account_name}**\n"
            response += f"• Main Account Rec ID: {main_account_rec_id}\n"
            response += f"• Type: {account_type}\n"
            if category_description:
                response += f"• Category: {category_description}\n"
            if category:
                response += f"• Category Code: {category}\n"
            response += "\n"

        if total_found > 10:
            response += f"... and {total_found - 10} more accounts\n\n"

        execution_time = time.time() - start_time
        response += f"⏱️ Search completed in {execution_time:.2f} seconds"

        return response

    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"Error in account search: {str(e)}")
        return f"❌ Error in account search: {str(e)}"


@tool
def get_account_balance(
    account_identifier: str,
    as_of_date: str = None,
    companies: str = None,
    use_account_id: bool = False,
) -> str:
    """
    Get account balance for specific accounts.

    First searches for the account to get its MainAccountRecId, then retrieves
    the balance using that ID for accurate results.

    Args:
        account_identifier: Account name (e.g., "Capital Bank") or MainAccountRecId if use_account_id=True
        as_of_date: Date for balance (YYYY-MM-DD). Defaults to today
        companies: Company codes (e.g., "BLS,BJO"). Leave empty for all
        use_account_id: If True, treat account_identifier as MainAccountRecId

    Returns:
        Account balance details with company breakdown

    Examples:
        get_account_balance("Capital Bank", "2025-08-02", "BLS")
        get_account_balance("5637157327", "2025-08-02", "BLS", use_account_id=True)
    """

    try:
        start_time = time.time()

        # Set default date if not provided
        if not as_of_date:
            as_of_date = date.today().strftime("%Y-%m-%d")

        main_account_rec_id = None
        account_name_for_display = account_identifier

        if use_account_id:
            # Use the provided ID directly
            main_account_rec_id = account_identifier
        else:
            # First, search for the account to get its MainAccountRecId
            search_payload = {"account_name": account_identifier, "limit": 5}

            if companies:
                company_list = [c.strip().upper() for c in companies.split(",")]
                search_payload["companies"] = company_list

            search_result = sync_system_authenticated_request(
                "/api/agent/finance/accounts/search",
                method="POST",
                json_data=search_payload,
            )

            if "error" in search_result:
                return f"❌ Error searching for account: {search_result['error']}"

            if search_result.get("status") != "success":
                return f"❌ Failed to find account '{account_identifier}'"

            accounts = search_result.get("accounts", [])
            if not accounts:
                return f"❌ No account found matching '{account_identifier}'"

            # Use the first matching account
            first_account = accounts[0]
            main_account_rec_id = first_account.get("main_account_rec_id")
            account_name_for_display = first_account.get("name", account_identifier)

            if not main_account_rec_id:
                return f"❌ Could not get MainAccountRecId for account '{account_identifier}'"

        # Now get the balance using MainAccountRecId
        balance_payload = {
            "main_account_rec_id": main_account_rec_id,
            "as_of_date": as_of_date,
            "include_details": True,
        }

        if companies:
            company_list = [c.strip().upper() for c in companies.split(",")]
            balance_payload["companies"] = company_list

        # Make authenticated API call for balance
        result = sync_system_authenticated_request(
            "/api/agent/finance/accounts/balance",
            method="POST",
            json_data=balance_payload,
        )

        if "error" in result:
            return f"❌ Error getting account balance: {result['error']}"

        if not result or result.get("status") == "error":
            return f"❌ {result.get('message', 'Failed to get account balance')}"

        if result.get("status") != "success":
            return f"❌ {result.get('message', 'Failed to get account balance')}"

        # Extract balance data
        account_info = result.get("account_info", {})
        accounts = result.get("accounts", [])
        total_balance = result.get("total_balance", 0)
        currency = result.get("currency", "USD")  # Default to USD if not provided

        if not accounts:
            return f"💰 No balance found for account '{account_name_for_display}' as of {as_of_date}"

        # Build response
        full_account_name = account_info.get("account_name", account_name_for_display)
        account_code = account_info.get("account_code", "N/A")
        account_type = account_info.get("account_type", "N/A")

        response = f"💰 **Account Balance** ({full_account_name})\n\n"
        response += f"**Account Details:**\n"
        response += f"• Code: {account_code}\n"
        response += f"• Type: {account_type}\n"
        response += f"• As of Date: {as_of_date}\n"
        response += f"• Currency: {currency}\n\n"

        if len(accounts) == 1:
            # Single company balance
            balance_info = accounts[0]
            # Use the actual field names from the API response
            account_name = balance_info.get("name", account_name_for_display)
            account_type_actual = balance_info.get("account_type", "N/A")
            balance = balance_info.get("ending_balance", 0)  # Fixed: use ending_balance

            response = f"💰 **Account Balance** ({account_name})\n\n"
            response += f"**Account Details:**\n"
            response += f"• Main Account Rec ID: {balance_info.get('main_account_rec_id', 'N/A')}\n"
            response += f"• Type: {account_type_actual}\n"
            response += (
                f"• Category: {balance_info.get('category_description', 'N/A')}\n"
            )
            response += f"• As of Date: {as_of_date}\n"
            response += f"• Currency: {currency}\n\n"

            response += f"**Balance: {currency} {balance:,.2f}**\n"

            # Add breakdown if available
            calculation_details = balance_info.get("calculation_details", {})
            if calculation_details:
                response += f"\n**Balance Breakdown:**\n"
                response += f"• Opening Balance (2024): {currency} {balance_info.get('opening_balance', 0):,.2f}\n"
                response += f"• Period Changes (2025): {currency} {balance_info.get('period_amount', 0):,.2f}\n"
                response += f"• Ending Balance: {currency} {balance:,.2f}\n"
        else:
            # Multiple companies
            response += f"**Total Balance: {currency} {total_balance:,.2f}**\n\n"
            response += "**Account Breakdown:**\n"

            for balance_info in accounts:
                account_name = balance_info.get("name", "Unknown Account")
                balance = balance_info.get(
                    "ending_balance", 0
                )  # Fixed: use ending_balance
                response += f"• {account_name}: {currency} {balance:,.2f}\n"

        execution_time = time.time() - start_time
        response += f"\n⏱️ Retrieved in {execution_time:.2f} seconds"

        return response

    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"Error getting account balance: {str(e)}")
        return f"❌ Error getting account balance: {str(e)}"


@tool
def get_account_balance_by_id(
    main_account_rec_id: str,
    as_of_date: str = None,
    companies: str = None,
    include_details: bool = True,
) -> str:
    """
    Get account balance directly using Main Account Record ID.

    This is a faster method when you already know the exact MainAccountRecId
    from a previous account search. Bypasses the search step.

    Args:
        main_account_rec_id: Main Account Record ID (e.g., "5637157327")
        as_of_date: Date for balance (YYYY-MM-DD). Defaults to today
        companies: Company codes (e.g., "BLS,BJO"). Leave empty for all
        include_details: Include detailed breakdown in response

    Returns:
        Account balance details with company breakdown

    Examples:
        get_account_balance_by_id("5637157327", "2025-08-02", "BLS")
        get_account_balance_by_id("5637157327", companies="BLS,BJO")
    """

    try:
        start_time = time.time()

        # Set default date if not provided
        if not as_of_date:
            as_of_date = date.today().strftime("%Y-%m-%d")

        # Prepare API payload directly with MainAccountRecId
        payload = {
            "main_account_rec_id": main_account_rec_id,
            "as_of_date": as_of_date,
            "include_details": include_details,
        }

        if companies:
            company_list = [c.strip().upper() for c in companies.split(",")]
            payload["companies"] = company_list

        # Make authenticated API call for balance
        result = sync_system_authenticated_request(
            "/api/agent/finance/accounts/balance", method="POST", json_data=payload
        )

        if "error" in result:
            return f"❌ Error getting account balance: {result['error']}"

        if not result or result.get("status") == "error":
            return f"❌ {result.get('message', 'Failed to get account balance')}"

        if result.get("status") != "success":
            return f"❌ {result.get('message', 'Failed to get account balance')}"

        # Extract balance data
        account_info = result.get("account_info", {})
        accounts = result.get("accounts", [])
        total_balance = result.get("total_balance", 0)
        currency = result.get("currency", "USD")  # Default to USD if not provided

        if not accounts:
            return f"💰 No balance found for account ID '{main_account_rec_id}' as of {as_of_date}"

        if len(accounts) == 1:
            # Single account balance
            balance_info = accounts[0]
            # Use the actual field names from the API response
            account_name = balance_info.get("name", f"Account ID {main_account_rec_id}")
            account_type_actual = balance_info.get("account_type", "N/A")
            balance = balance_info.get("ending_balance", 0)  # Fixed: use ending_balance

            response = f"💰 **Account Balance** ({account_name})\n\n"
            response += f"**Account Details:**\n"
            response += f"• Main Account Rec ID: {main_account_rec_id}\n"
            response += f"• Type: {account_type_actual}\n"
            response += (
                f"• Category: {balance_info.get('category_description', 'N/A')}\n"
            )
            response += f"• As of Date: {as_of_date}\n"
            response += f"• Currency: {currency}\n\n"

            response += f"**Balance: {currency} {balance:,.2f}**\n"

            # Add breakdown if available
            calculation_details = balance_info.get("calculation_details", {})
            if calculation_details:
                response += f"\n**Balance Breakdown:**\n"
                response += f"• Opening Balance (2024): {currency} {balance_info.get('opening_balance', 0):,.2f}\n"
                response += f"• Period Changes (2025): {currency} {balance_info.get('period_amount', 0):,.2f}\n"
                response += f"• Ending Balance: {currency} {balance:,.2f}\n"
        else:
            # Multiple accounts
            response = f"💰 **Account Balances** (ID: {main_account_rec_id})\n\n"
            response += f"**Total Balance: {currency} {total_balance:,.2f}**\n\n"
            response += "**Account Breakdown:**\n"

            for balance_info in accounts:
                account_name = balance_info.get("name", "Unknown Account")
                balance = balance_info.get(
                    "ending_balance", 0
                )  # Fixed: use ending_balance
                response += f"• {account_name}: {currency} {balance:,.2f}\n"

        execution_time = time.time() - start_time
        response += f"\n⏱️ Retrieved in {execution_time:.2f} seconds"

        return response

    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"Error getting account balance by ID: {str(e)}")
        return f"❌ Error getting account balance by ID: {str(e)}"


@tool
def debug_api_response(
    endpoint: str,
    start_year: int = None,
    start_month: int = None,
    end_year: int = None,
    end_month: int = None,
    companies: str = None,
) -> str:
    """
    Debug tool to inspect raw API responses and understand data structure.

    Useful for understanding what detailed data is available from the API
    when the standard tools seem to be missing information.

    Args:
        endpoint: API endpoint to call ("trends", "balance-sheet", "income-statement")
        start_year: Starting year for time-based queries
        start_month: Starting month for time-based queries
        end_year: Ending year for time-based queries
        end_month: Ending month for time-based queries
        companies: Company codes (e.g., "BLS,BJO")

    Returns:
        Raw API response structure for analysis

    Examples:
        debug_api_response("trends", 2025, 1, 2025, 8, "BLS")
    """

    try:
        start_time = time.time()

        # Prepare payload based on endpoint
        payload = {}

        if endpoint == "trends":
            current_date = datetime.now()
            payload = {
                "start_year": start_year or (current_date.year - 1),
                "start_month": start_month or 1,
                "end_year": end_year or current_date.year,
                "end_month": end_month or current_date.month,
                "include_growth_rates": True,
                "include_quarterly_summary": True,
            }
            api_endpoint = "/api/agent/finance/trends"

        elif endpoint == "balance-sheet":
            from datetime import date

            payload = {
                "as_of_date": f"{end_year or 2025}-{end_month or 8:02d}-31",
                "include_details": True,
            }
            api_endpoint = "/api/agent/finance/balance-sheet"

        elif endpoint == "income-statement":
            payload = {
                "start_year": start_year or 2025,
                "start_month": start_month or 1,
                "end_year": end_year or 2025,
                "end_month": end_month or 8,
                "include_details": True,
            }
            api_endpoint = "/api/agent/finance/income-statement"

        else:
            return f"❌ Unknown endpoint: {endpoint}. Use 'trends', 'balance-sheet', or 'income-statement'"

        if companies:
            company_list = [c.strip().upper() for c in companies.split(",")]
            payload["companies"] = company_list

        # Make authenticated API call
        result = sync_system_authenticated_request(
            api_endpoint, method="POST", json_data=payload
        )

        if "error" in result:
            return f"❌ Error calling API: {result['error']}"

        # Format response for inspection
        execution_time = time.time() - start_time

        response = f"🔍 **API Response Debug** (Endpoint: {endpoint})\n\n"
        response += f"**Request Payload:**\n```json\n{payload}\n```\n\n"
        response += f"**Response Structure:**\n"

        def format_dict(d, indent=0):
            """Recursively format dictionary structure"""
            output = ""
            spaces = "  " * indent

            for key, value in d.items():
                if isinstance(value, dict):
                    output += f"{spaces}• {key} (dict, {len(value)} keys):\n"
                    if len(value) <= 5:  # Show full structure for small dicts
                        output += format_dict(value, indent + 1)
                    else:  # Show just keys for large dicts
                        output += f"{spaces}  Keys: {list(value.keys())[:10]}{'...' if len(value) > 10 else ''}\n"
                elif isinstance(value, list):
                    output += f"{spaces}• {key} (list, {len(value)} items)\n"
                    if len(value) > 0 and isinstance(value[0], dict):
                        output += f"{spaces}  Sample item keys: {list(value[0].keys())[:5]}{'...' if len(value[0]) > 5 else ''}\n"
                else:
                    value_str = (
                        str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
                    )
                    output += f"{spaces}• {key}: {value_str}\n"
            return output

        if isinstance(result, dict):
            response += format_dict(result)
        else:
            response += f"Response type: {type(result)}\n"
            response += f"Response: {str(result)[:500]}{'...' if len(str(result)) > 500 else ''}\n"

        response += f"\n⏱️ Debug completed in {execution_time:.2f} seconds"

        return response

    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"Error in API debug: {str(e)}")
        return f"❌ Error in API debug: {str(e)}"
