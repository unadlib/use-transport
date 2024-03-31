# use-transport

![Node CI](https://github.com/unadlib/use-transport/workflows/Node%20CI/badge.svg)
[![npm](https://img.shields.io/npm/v/use-transport.svg)](https://www.npmjs.com/package/use-transport)
![license](https://img.shields.io/npm/l/use-transport)

A React hook with simple and responsible universal transports.

### Motivation

`use-transport` is a React hook that provides a simple and responsible way to manage data transport. It is designed to be used with [`data-transport`](https://github.com/unadlib/data-transport) to provide a universal transport solution.

`data-transport` is a generic and responsible communication transporter:

- iframe
- Broadcast
- Web Worker
- Service Worker
- Shared Worker
- Browser Extension
- Node.js
- WebRTC
- Electron
- More transport port

### Installation

```bash
npm install use-transport data-transport
# or
yarn add use-transport data-transport
```

### Features

- Simple and responsible
- Support for multiple transport ports
- Support for mock transport
- Full TypeScript support

### API

You can use the `use-transport` hook to create a transport instance.

```jsx
import React from 'react';
import { useTransport } from 'use-transport';

const App = () => {
  const transport = useTransport('IFrameMain', {});

  transport.listen(
    'hello',
    async () => {
      return 'world';
    },
    []
  );

  const handleClick = async () => {
    const response = await transport.emit('ping');
    console.log(response);
  };

  return <button onClick={handleClick}>Ping</button>;
};
```

#### Parameters

| Name      | Type   | Description            |
| --------- | ------ | ---------------------- |
| `type`    | enums  | Transport port type    |
| `options` | object | Transport port options |

#### Returns

| Name               | Type     | Description                |
| ------------------ | -------- | -------------------------- |
| `transport.emit`   | function | Emit a message             |
| `transport.listen` | hook     | Listen a message with deps |

> The `use-transport` hook returns a transport instance. more API details can be found in the [data-transport](https://github.com/unadlib/data-transport) documentation.

## License

`use-transport` is [MIT licensed](https://github.com/unadlib/use-transport/blob/main/LICENSE).
