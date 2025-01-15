---
title: 使用llama.cpp推理大模型
author: tyk
date: 2024-01-02 10:04:14
tags:
---

## llama.cpp

大模型有训练和推理两部分，训练会产生一个大模型文件，这些文件通常包含了模型架构以及每个神经元的权重和偏置值。[llama.cpp](https://github.com/ggerganov/llama.cpp)主要用在推理部分，它是一个是一个使用`c++`开发的大模型推理框架。它可以在普通家用电脑上完成推理，只需要CPU和几个G的内存就能运行。

### 编译安装

> 参考 <https://github.com/ggerganov/llama.cpp?tab=readme-ov-file#build>

1. 拉取代码

    ```
    git clone https://github.com/ggerganov/llama.cpp.git
    ```

2. 编译

    > 对于非`Apple Silicon`系列芯片推理时如果有问题可以在编译时禁用`GPU`。编译时使用`LLAMA_NO_METAL=1`或者`LLAMA_METAL=OFF`参数。<https://github.com/ggerganov/llama.cpp?tab=readme-ov-file#metal-build>

    ```
    make
    ```

编译完成会参数`mian`和`quantize`文件，前者用来运行大模型推理，后者用来模型向量化处理。

### 模型转换

一般大模型文件都托管在[Hugging Face](https://huggingface.co/)上面。一般情况下`llama.cpp`不能直接使用这些大模型进行推理，我们需要先对这些模型进行转换，转为`ggml`格式。支持转换的大模型列表参考官方[README](https://github.com/ggerganov/llama.cpp?tab=readme-ov-file#description)国产大模型百川、千问等都支持转为`ggml`格式。

转换使用`llama.cpp`项目内的`convert.py`或者`convert-hf-to-gguf.py`处理，详细步骤参考 <https://github.com/ggerganov/llama.cpp?tab=readme-ov-file#prepare-data--run>。这里对Python版本有一定的要求，模块的依赖在`requirements.txt`和`requirements`目录下。

一般情况先使用`convert.py`转换，如果转换失败在使用`convert-hf-to-gguf.py`尝试处理。注意，使用`convert-hf-to-gguf.py`时需要我们安装额外的依赖，依赖列表在`requirements/requirements-convert-hf-to-gguf.txt`。

转换后的模型我们需要进行向量化，使用`./quantize`对转换后的模型进行向量化。向量化后的模型就可以进行推理了。

### 和llama.cpp类似的工具

- [chatglm.cpp](https://github.com/li-plus/chatglm.cpp)

    一个用于[ChatGLM](https://github.com/THUDM/ChatGLM3)大模型推理框架

- [PowerInfer](https://github.com/SJTU-IPADS/PowerInfer)
    
    - 一个可以在消费级GPU运行的大模型推理框架

### Hugging Face 镜像

- [modelscope](https://www.modelscope.cn/models)

    可以直接使用`git clone`拉取大模型。注意，需要安装[LFS](https://git-lfs.com/)

- [hf-mirror](https://hf-mirror.com/)

    配置镜像后可以使用`huggingface`官方命令行`huggingface-cli`工具下载模型文件

    ```bash
    export HF_ENDPOINT=https://hf-mirror.com
    ```

### 名词解释

- B 
    大模型参数单位，1B表示十亿。例如有`7B`、`14B`表示参数有70亿和140亿，参数越大推理时耗费的资源越多
