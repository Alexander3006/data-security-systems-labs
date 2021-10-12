[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b7577bff0cdb4d859ef6e68b7030c253)](https://app.codacy.com/gh/Alexander3006/ServerStarterKit?utm_source=github.com&utm_medium=referral&utm_content=Alexander3006/ServerStarterKit&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://travis-ci.org/Alexander3006/ServerStarterKit.svg?branch=main)](https://travis-ci.org/Alexander3006/ServerStarterKit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# ServerStarterKit

## Framework for Node.JS, which has the following functionality:
- IoC Container (singleton/transient(ready), scoped(in developing))
- Router
- Basic transport(HTTP\WS) with the ability to connect custom adapters
- Controller service, that can automatically load controllers and monitor them
- Service virtualization and execution context constraints
- Sessions and session storage that can be extended with custom adapters

At the root of the repository and the directory "Controllers" are examples of using and configuring the environment.
The source directory is "Framework"!

In the plans:
- cover with tests
- move examples to a separate directory
- optimize work with custom interfaces(Symbols) and add validation for them
- add the ability to more conveniently add classes to the execution context avoiding dependencies on IoC Container
