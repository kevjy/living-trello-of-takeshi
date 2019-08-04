# User-configuration of recurring cards

Users should be able to configure their recurring cards e.g. recur interval, start date, etc. 

## Where do users provide the config?

The description of the recurring card. For now we interpret the whole description as the configuration, but consider allowing users to also put a description that also gets copied to the new cards that are created from recurring cards.

## Config yaml 

We're using yaml since it's very human readable, easy to write and easy to read with javascript libraries. See [examples](#examples) at the bottom.

* `recur`
  * `every` - recurring period config
    * `multiplier` (positive integer) - multiplies the given `recur.every.period`.
    * `period` (`"day" | "week" | "month" | "year"`) - recurring period
  * `on` - recurring day config
    * `day` (positive integer) - `1 <= recur.on.day <= recur.every.period * recur.every.multiplier`

## Examples:

### Recur every week on day 1 (monday)

```yaml
recur:
  every:
    multiplier: 1
    period: "week"
  on:
    day: 1
```

### Recur every 2 weeks on day 12 (second friday)

```yaml
recur:
  every:
    multiplier: 2
    period: "week"
  on:
    day: 12
```


