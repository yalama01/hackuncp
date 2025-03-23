from typing import Dict, List


def filter_dict(data: Dict, keys_to_keep: List[str]) -> Dict:
    """Return a new dictionary containing only the specified keys."""
    return {key: data[key] for key in keys_to_keep if key in data}