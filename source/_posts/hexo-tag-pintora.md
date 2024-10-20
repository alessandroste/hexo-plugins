---
title: hexo-tag-pintora
category: plugin
---
This plugin adds a tag `{% pintora %}{% endpintora %}` to generate diagrams using [Pintora](https://pintorajs.vercel.app/). Pintora generates a **svg** that is embedded in the HTML, so you can style it using CSS. No JavaScript is required once the page is generated.

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
Currently available at [GitHub registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)
```
npm install @alessandroste/hexo-tag-pintora
```
## Configuration
### In `_config.yaml`:
```yaml
pintora:
    textWidthRatio: 9
    background: transparent # or solid
    svgClass: diagram
    pintoraConfig: {} # the Config at https://pintorajs.vercel.app/docs/configuration/config/
```
### Inline
```markdown
    {% pintora textWidthRatio:9 %}
    ...
    {% endpintora %}
```

## Theming
Since the **svg** is embedded in the HTML, you can style it using CSS.
The default class is `diagram` but it is overridable at configuration level.
```css
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