# Rate limiter simulator

## Instalation

```
git clone git@github.com:dusmel/rate-limiter-simulator.git
cd rate-limiter-simulator
pnpm install
pnpm dev
```

Default config


```
  timewindow: 10 seconds, max: 4 requests per client
  monthly: 30 days, max 6 requests per client
  system: 10 requests 
```
<p className=" border-t mt-4"> 
  You can change this in the backend inside the config.ts apiKeys.js and tokens.js files.
  <br />

  Tips💡: you can delete the entry in redis to try many times <code>DEL 0852b9b3-ee95774f</code>
</p>
