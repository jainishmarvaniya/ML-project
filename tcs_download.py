import yfinance as yf

# Download TCS historical data
df = yf.download(
    "TCS.NS",
    start="2002-08-12",   # TCS listing date
    end=None,             # Today
    interval="1d",
    progress=True
)

# Save to CSV
df.to_csv("TCS_Historical_Data.csv")

print("Download Completed!")
print(f"Total Rows: {len(df)}")
print("CSV File: TCS_Historical_Data.csv")