import json

# Assuming `data` is your loaded JSON object
with open("tft-trait.json") as f:
    data = json.load(f)


# Extract only entries with IDs starting with "TFT14_"
id_to_name = {
    entry["id"]: entry["name"]
    for entry in data["data"].values()
    if entry["id"].startswith("TFT14_")
}

print(id_to_name)
