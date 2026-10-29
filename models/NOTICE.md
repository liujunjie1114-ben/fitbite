# MobileNet V2 Food-101

Original model and fine-tuning: AlexKoff88.

Source: https://huggingface.co/AlexKoff88/mobilenet_v2_food101

Training / export source: https://github.com/AlexKoff88/mobilenetv2_food101

License: Apache License 2.0. See APACHE-LICENSE-2.0.txt.

The distributed mobilenet_v2_food101.onnx was re-exported by FitBite from the original trained PyTorch checkpoint in evaluation mode using scripts/export-model.py. The upstream pre-exported ONNX file did not pass a local non-uniform-logit smoke test and is not used.

Original trained checkpoint SHA-256: 42cd5d9988f0830588b3be5107197c9b622c9b73426377975c07e8b24e346680. FitBite provides independent browser preprocessing, local ONNX Runtime inference and a Chinese interface. The model classifies Food-101 dishes; it does not weigh food or estimate nutrient composition.
