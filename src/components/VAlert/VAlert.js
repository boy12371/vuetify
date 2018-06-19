import '../../stylus/components/_alerts.styl'

import VIcon from '../VIcon'

import Colorable from '../../mixins/colorable'
import Toggleable from '../../mixins/toggleable'
import Transitionable from '../../mixins/transitionable'

export default {
  name: 'v-alert',

  mixins: [Colorable, Toggleable, Transitionable],

  props: {
    dismissible: Boolean,
    icon: String,
    outline: Boolean,
    type: {
      type: String,
      validator (val) {
        return [
          'info',
          'error',
          'success',
          'warning'
        ].includes(val)
      }
    }
  },

  computed: {
    computedColor () {
      return (this.type && !this.color) ? this.type : (this.color || 'error')
    },
    computedIcon () {
      if (this.icon || !this.type) return this.icon

      switch (this.type) {
        case 'info': return '$vuetify.icons.info'
        case 'error': return '$vuetify.icons.error'
        case 'success': return '$vuetify.icons.success'
        case 'warning': return '$vuetify.icons.warning'
      }
    }
  },

  render (h) {
    const children = [h('div', this.$slots.default)]

    if (this.computedIcon) {
      children.unshift(h(VIcon, {
        'class': 'v-alert__icon'
      }, this.computedIcon))
    }

    if (this.dismissible) {
      const close = h('a', {
        'class': 'v-alert__dismissible',
        on: { click: () => this.$emit('input', false) }
      }, [
        h(VIcon, {
          props: {
            right: true
          }
        }, '$vuetify.icons.cancel')
      ])

      children.push(close)
    }

    const setColor = this.outline ? this.setTextColor : this.setBackgroundColor
    const alert = h('div', setColor(this.computedColor, {
      staticClass: 'v-alert',
      'class': {
        'v-alert--outline': this.outline
      },
      directives: [{
        name: 'show',
        value: this.isActive
      }],
      on: this.$listeners
    }), children)

    if (!this.transition) return alert

    return h('transition', {
      props: {
        name: this.transition,
        origin: this.origin,
        mode: this.mode
      }
    }, [alert])
  }
}
