---
title: hexo-tag-pintora
category: plugin
---
This plugin adds a tag `{% pintora %}{% endpintora %}` to generate diagrams using [Pintora](https://pintorajs.vercel.app/).
Pintora generates a **svg** that is embedded in the HTML, so you can style it using CSS.

## Example

{% pintora textWidthRatio:9 %}
mindmap
* UML Diagram
** Sequence Diagram
** State Diagram
** Component Diagram
* Non-UML Diagram
** Entity Relationship Diagram
** Mind Map
{% endpintora %}

## Installation

## Configuration

## Theming
Since the **svg** is embedded in the HTML, you can style it using CSS.
The default class is `diagram` but it is overridable at configuration level.

```
svg.diagram {
    path {
        &:not([stroke-linejoin]) {
            fill: --diagram-fill;
        }

        stroke: --diagram-stroke;
    }

    path.label-bg {
        fill: --diagram-back-fill;
    }

    .activity__keyword circle {
        fill: --diagram-fill;
    }

    .activity__condition-end {
        fill: --diagram-fill;
    }

    text {
        fill: --diagram-fill;
    }

    text.activity__edge-label {
        fill: --diagram-fill;
    }
}
```