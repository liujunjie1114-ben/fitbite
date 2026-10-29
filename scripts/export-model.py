"""Optional maintainer tool: export the original trained checkpoint for the browser.

Requires torch, torchvision and onnx. The web app itself does not need Python.
Usage: python scripts/export-model.py CHECKPOINT --output models/mobilenet_v2_food101.onnx
"""
import argparse
from pathlib import Path

import torch
from torchvision.models import mobilenet_v2

parser = argparse.ArgumentParser()
parser.add_argument("checkpoint", type=Path)
parser.add_argument("--output", type=Path, default=Path("models/mobilenet_v2_food101.onnx"))
args = parser.parse_args()
checkpoint = torch.load(args.checkpoint, map_location="cpu", weights_only=True)
weights = checkpoint.get("state_dict", checkpoint)
weights = {key.removeprefix("module."): value for key, value in weights.items()}
model = mobilenet_v2(weights=None, num_classes=101)
model.load_state_dict(weights, strict=True)
model.eval()
torch.onnx.export(
    model, torch.zeros(1, 3, 224, 224), str(args.output),
    input_names=["input"], output_names=["logits"],
    opset_version=17, dynamo=False,
)
print(f"Exported trained model: {args.output} ({args.output.stat().st_size} bytes)")
