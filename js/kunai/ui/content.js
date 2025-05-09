import * as Badge from './badge'
import {Tooltip} from './tooltip'


const _hitElementRects = (elem, x, y) => {
  for (const rect of elem.getClientRects())
    if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
      return rect
  return null
}

class Content {
  constructor(log) {
    this.log = log.makeContext('Content')
    this.log.debug('initializing...')

    this.log.debug(`found ${Badge.sanitize($('main[role="main"] div[itemtype="http://schema.org/Article"] .content-body span.cpp'))} badges`)

    // 横幅を超える画像を横スクロール可能にするためにスクロール用のdivで囲む
    $('div[itemprop="articleBody"]').find('img').wrap('<div class="scrollable">')

    // ページ推移後にキーボードで画面スクロールするためにフォーカスを当てる
    $('main[role="main"] div[itemtype="http://schema.org/Article"]').trigger('focus')

    this.setupTooltip()
  }

  setupTooltip() {
    const tooltip = new Tooltip(document)
    let target = null

    $('a[data-desc]').on({
      mouseover: function(e) {
        const rect = _hitElementRects(this, e.clientX, e.clientY)
        if (rect) {
          target = this
          tooltip.show(this.dataset.desc, e.clientX, e.clientY, rect)
        }
      },
      mouseout: function() {
        if (this === target) {
          target = null
          tooltip.hide()
        }
      }
    })

    const checkScroll = function(e) {
      if (target !== null && !_hitElementRects(target, e.clientX, e.clientY)) {
        target = null
        tooltip.hide()
      }
    }
    window.addEventListener('scroll', checkScroll, true)
    window.addEventListener('resize', checkScroll)
  }
}

export {Content}
