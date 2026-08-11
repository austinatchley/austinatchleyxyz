(function () {
  'use strict'

  // Tag filter for the /posts/ list page. Reads the current selection from the
  // URL (?tags=a,b), toggles chips, and shows/hides post items whose data-tags
  // contain every selected tag. Pure client-side: no rebuild needed.
  var WRAP = '[data-tag-filter]'
  var ITEM = '[data-tags]'

  var wrap = document.querySelector(WRAP)
  if (!wrap) return

  var chips = Array.prototype.slice.call(wrap.querySelectorAll('[data-tag]'))
  var items = Array.prototype.slice.call(document.querySelectorAll(ITEM))
  var select = document.querySelector('[data-tag-filter-select]')
  var clearBtn = document.querySelector('[data-tag-filter-clear]')

  function readSelection() {
    try {
      var q = new URLSearchParams(location.search).get('tags')
      if (!q) return []
      return q.split(',').filter(Boolean)
    } catch (e) {
      return []
    }
  }

  var selected = readSelection()

  function itemTags(el) {
    var v = el.getAttribute('data-tags') || ''
    return v.split(':').filter(Boolean)
  }

  function matches(el) {
    if (selected.length === 0) return true
    var t = itemTags(el)
    // OR logic: show any post that carries at least one selected tag.
    return selected.some(function (tag) {
      return t.indexOf(tag) !== -1
    })
  }

  function apply() {
    items.forEach(function (el) {
      var show = selected.length === 0 || matches(el)
      el.style.display = show ? '' : 'none'
    })
    chips.forEach(function (c) {
      c.classList.toggle('is-active', selected.indexOf(c.getAttribute('data-tag')) !== -1)
    })
    if (select) {
      select.textContent =
        selected.length === 0 ? 'All posts' : ('Matching ' + selected.length + ' tag' + (selected.length > 1 ? 's' : ''))
    }
    if (clearBtn) {
      clearBtn.style.display = selected.length ? '' : 'none'
    }
  }

  function updateUrl() {
    var url = new URL(location.href)
    if (selected.length) {
      url.searchParams.set('tags', selected.join(','))
    } else {
      url.searchParams.delete('tags')
    }
    history.replaceState({}, '', url.toString())
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var tag = chip.getAttribute('data-tag')
      var i = selected.indexOf(tag)
      if (i === -1) {
        selected.push(tag)
      } else {
        selected.splice(i, 1)
      }
      updateUrl()
      apply()
    })
  })

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      selected = []
      updateUrl()
      apply()
    })
  }

  apply()
})()