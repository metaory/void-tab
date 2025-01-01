#  ▀▄▀ █ █▀▀ █▀█
#  █░█ █ █▄▄ █▄█
#  ▁▁▁▁▁▁▁▁v0.7▁
#
#
# ░░ USAGE ░░░░░░░░░░░░░░░░░░░░░░
# ░░ ▔▔▔▔▔                     ░░
# ░░   run this template       ░░
# ░░                           ░░
# ░░  xico -t .github/icon.xc  ░░
# ░░                           ░░
# ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

set d 0
set o 1
set r 40
set ff monospace
set fw bold
set fs 6.8em
set bg #55FFDD
set fg #3311FF
set stroke #55FFDD
set border 6

pre icons

set s 16
put 􀕨  icon_16.png

set s 32
put 􀕨  icon_32.png

set s 48
put 􀕨  icon_48.png

set s 128
put 􀕨  icon_128.png

# 􀣳
# 􀘞 􀋂 􀋃 􀋄 􀋅 􀋆
# 􀝜 􀜚 􀕧 􀕨 􀕩 􀕪 􀕫 􀕬 􀕭 􀒺 􀒻 􀍷
# 􀴾 􀴿 􀵀
# 􀷙 􀷚

# 􀙢 􀙣
# set bg #3311FF
# set fg #55FFDD

# 􀢙 􀢚

#✧
# set bg #222233
# set x 50
# set y 50
# set xbg #DD6688
# set xbo 0

#
# ╭────────────────────┬────────┬────────────────┬───────────────────────────────────────────────────────────────────────────────────╮
# │ option             │ alias  │ default        │ type                                                                              │
# ╞════════════════════╪════════╪════════════════╪═══════════════════════════════════════════════════════════════════════════════════╡
# │ r_fill             │ bg     │ black          │ [ <hex-color> | <named-color> | <rgb()> | <rgba()> | <hsl()> <hsla()> | <lab()> ] │
# │ r_width            ┆ w      ┆ 100            ┆ [ auto | <length> | <percentage> ]                                                │
# │ r_height           │ h      │ 100            │ [ auto | <length> | <percentage> ]                                                │
# │ r_opacity          ┆ o      ┆ 0.5            ┆ [ <number>(0,1) | <percentage> ]                                                  │
# │ r_rx               │ r      │ 25             │ [ <length> | <percentage> | auto ]                                                │
# │ r_ry               ┆ r      ┆ 25             ┆ [ <length> | <percentage> | auto ]                                                │
# │ r_x                │        │ 0              │ [ <length> | <percentage> ]                                                       │
# │ r_y                ┆        ┆ 0              ┆ [ <length> | <percentage> ]                                                       │
# ├╌─╌╌╌─╌╌─╌─╌╌╌╌─┄╌──┼─╌╌─╌─╌─┼─╌╌─╌╌─╌─╌──────┼─╌╌─╌─╌─╌╌─╌─╌─╌╌─╌─╌──╌╌─╌─╌─╌╌─╌─╌──╌╌─╌─╌──╌╌─╌─╌─╌╌─╌─╌──╌╌─╌─╌─╌╌─╌─╌─────────┤
# │ t_fill             │ fg     │ #3311FF        │ [ <hex-color> | <named-color> | <rgb()> | <rgba()> | <hsl()> <hsla()> | <lab()> ] │
# │ t_stroke-color     │ stroke │ cyan           │ [ <hex-color> | <named-color> | <rgb()> | <rgba()> | <hsl()> <hsla()> | <lab()> ] │
# │ t_stroke-width     │ border │ 0              │ [ <length> | <percentage> ]                                                       │
# │ t_stroke-linecap   │        │ round          │ [ <butt | round | square> ]                                                       │
# │ t_stroke-linejoin  │        │ round          │ [ <arcs | bevel |miter | miter-clip | round> ]                                    │
# │ t_font-family      ┆ ff     ┆ monospace      ┆ [ <family-name> | <generic-family> ]                                              │
# │ t_font-weight      │ fw     │ bold           │ [ <normal | bold | bolder | lighter | <number> ]                                  │
# │ t_font-size        ┆ fs     ┆ 8em            ┆ [ <absolute-size> | <relative-size> | <length-percentage> ]                       │
# │ t_rotate           │ rotate │ 0              │ [ auto | auto-reverse | <number> ]                                                │
# │ t_transform        │        │ translate(0,0) │ [ <transform-function> ]                                                          │
# │ t_transform-origin ┆        ┆ center         ┆ [ <transform-origin> ]                                                            ┆
# │ t_dx               │        │ 0              │ [ <length-percentage> | <number> ]                                                │
# │ t_dy               ┆        ┆ 3.5            ┆ [ <length-percentage> | <number> ]                                                │
# │ t_x                │ x      │ 50             │ [ <length> | <percentage> ]                                                       │
# │ t_y                ┆ y      ┆ 50             ┆ [ <length> | <percentage> ]                                                       │
# ╰────────────────────┴────────┴────────────────┴───────────────────────────────────────────────────────────────────────────────────╯
# ╭─────────────────────┬───────┬─────────┬──────────────────────────────────╮
# │ option              │ alias │ default │ type                             │
# ╞═════════════════════╪═══════╪═════════╪══════════════════════════════════╡
# │ background          ╎ xbg   ╎ black   ╎ [ <color> ]                      │
# │ background-opacity  ╎ xbo   ╎ 0       ╎ [ <number>(0,1) | <percentage> ] │
# │ size                ╎ s     ╎ 500     ╎ [ <number> ]                     │
# │ delay               ╎ d     ╎ 3       ╎ [ <number> ]                     │
# ╰─────────────────────┴───────┴─────────┴──────────────────────────────────╯

##########################################################
#### 💡 Check complete template templates/default.xc   ###
##########################################################
#
## copy the starter template and start there
#
# cp templates/starter.xc <path>
# xico -t starter.xc
###########################################################

# vim: ft=ini:syntax=spec:commentstring=#%s:nowrap:nornu:nonu:nospell:nocul:nocuc

char: "虚"
options:
  size: 128
  bg: "#000000"
  fg: "#44DDEE"
  font: "Noto Sans CJK JP"
  style: "Bold"
  padding: 20
  radius: 32
