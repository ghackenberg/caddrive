# CADdrive dependencies

Install third party dependencies as follows:

```bash
cd <CADdrive>/packages/node

npm install
```

## ⚠️ Possible errors

###  Microsoft Visual Studio 2017 or newer not found

#### Problem

You might get the following error telling you, that you are missing Visual Studio 2017 or newer and the "Desktop development with C++" workload.

![](../errors/desktop-development-with-cpp.png)

#### Solution

To solve the problem, install Visual Studio and the "Desktop development with C++" workload on your machine.

![](../errors/desktop-development-with-cpp-workload.png)

### Python `distutils` not found

#### Problem

![](../errors/no-module-named-distutils.png)

#### Solution

![](../errors/pip-install-setuptools.png)