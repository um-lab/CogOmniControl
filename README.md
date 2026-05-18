# CogOmniControl &mdash; Project Page

Official project page of **CogOmniControl: Reasoning-Driven Controllable Video Generation via Creative Intent Cognition**.

> Hongji Yang<sup>1,*</sup>, Songlian Li<sup>2,*</sup>, Yucheng Zhou<sup>1</sup>, Xiaotong Zhao<sup>2</sup>, Alan Zhao<sup>2</sup>, Chengzhong Xu<sup>1</sup>, Jianbing Shen<sup>1,&#9993;</sup>
>
> <sup>1</sup>SKL-IOTSC, CIS, University of Macau &nbsp; <sup>2</sup>Online-Video BU, Tencent
>
> <sup>*</sup> Equal contribution. &nbsp; <sup>&#9993;</sup> Corresponding author.

## Run locally

The site is plain static HTML/CSS/JS &mdash; no build step required.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Project layout

```
.
├── index.html
└── assets/
    ├── static/
    │   ├── style.css
    │   ├── script.js
    │   ├── teaser.{svg|png|jpg|pdf}      # auto-detected by script.js
    │   └── pipeline.{svg|png|jpg|pdf}    # auto-detected by script.js
    └── examples/
        ├── example1/  control.mp4  ref.jpg  output.mp4
        ├── example2/                ref.jpg  output.mp4
        └── ...
```

## Adding an example

Each example is an `<article class="example">` in `index.html`. Toggle the input layout via two data-attributes:

```html
<article class="example" data-has-control="true|false" data-has-ref="true|false">
```

| `has-control` | `has-ref` | Layout                              |
|---------------|-----------|-------------------------------------|
| true          | true      | 3 cols: control + ref + prompt      |
| true          | false     | 2 cols: control + prompt            |
| false         | true      | 2 cols: ref + prompt                |
| false         | false     | prompt only                         |

Generated videos always render below the inputs in a wide 16:9 player.

## Teaser / Pipeline figures

Drop one of `teaser.{svg|png|jpg|pdf}` (or `pipeline.*`) into `assets/static/`. The page probes extensions in this order &mdash; first match wins:

```
svg → png → jpg → jpeg → webp → pdf
```

Vector formats (SVG, PDF) are recommended for crisp rendering at any zoom.

## License

To be released.
