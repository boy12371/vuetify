// Styles
import '../../stylus/components/_radios.styl'

// Components
import VIcon from '../VIcon'
import VLabel from '../VLabel'

// Mixins
import Colorable from '../../mixins/colorable'
import Rippleable from '../../mixins/rippleable'
import Themeable from '../../mixins/themeable'
import {
  inject as RegistrableInject
} from '../../mixins/registrable'

// Utils
import { keyCodes } from '../../util/helpers'

export default {
  name: 'v-radio',

  inheritAttrs: false,

  inject: {
    name: {
      default: false
    },
    isMandatory: {
      default: false
    },
    validationState: {
      default: false
    }
  },

  mixins: [
    Colorable,
    Rippleable,
    RegistrableInject('radio', 'v-radio', 'v-radio-group'),
    Themeable
  ],

  data: () => ({
    isActive: false,
    isFocused: false,
    parentError: false
  }),

  props: {
    color: {
      type: [Boolean, String],
      default: 'accent'
    },
    disabled: Boolean,
    label: String,
    onIcon: {
      type: String,
      default: '$vuetify.icons.radioOn'
    },
    offIcon: {
      type: String,
      default: '$vuetify.icons.radioOff'
    },
    readonly: Boolean,
    value: null
  },

  computed: {
    computedData () {
      const setColor = (!this.parentError && this.isActive) ? this.setTextColor : (c, v) => v

      return setColor(this.color, {
        staticClass: 'v-radio',
        'class': {
          'v-radio--is-disabled': this.isDisabled,
          'v-radio--is-focused': this.isFocused,
          'theme--dark': this.dark,
          'theme--light': this.light
        }
      })
    },
    computedColor () {
      return this.isActive ? this.color : this.validationStateProxy
    },
    computedIcon () {
      return this.isActive
        ? this.onIcon
        : this.offIcon
    },
    hasState () {
      return this.isActive || !!this.validationStateProxy
    },
    isDisabled () {
      return this.disabled || this.readonly
    },
    validationStateProxy () {
      return this.validationState && this.validationState()
    }
  },

  mounted () {
    this.radio.register(this)
  },

  beforeDestroy () {
    this.radio.unregister(this)
  },

  methods: {
    genInput (type, attrs) {
      return this.$createElement('input', {
        attrs: Object.assign({}, attrs, {
          'aria-label': this.label,
          name: this.name && this.name(),
          role: type,
          type,
          checked: this.isActive
        }),
        on: {
          blur: this.onBlur,
          change: this.onChange,
          focus: this.onFocus,
          keydown: e => {
            if ([keyCodes.enter, keyCodes.space].includes(e.keyCode)) {
              e.preventDefault()
              this.onChange()
            }
          }
        },
        ref: 'input'
      })
    },
    genLabel () {
      return this.$createElement(VLabel, {
        on: { click: this.onChange },
        attrs: {
          for: this.id
        },
        props: {
          color: this.validationStateProxy,
          focused: this.hasState
        }
      }, this.$slots.label || this.label)
    },
    genRadio () {
      return this.$createElement('div', {
        staticClass: 'v-input--selection-controls__input'
      }, [
        this.genInput('radio', {
          'aria-checked': this.isActive.toString(),
          ...this.$attrs
        }),
        this.genRipple(this.setTextColor(this.computedColor, {})),
        this.$createElement(VIcon, this.setTextColor(this.computedColor, {}), this.computedIcon)
      ])
    },
    onFocus () {
      this.isFocused = true
    },
    onBlur (e) {
      this.isFocused = false
      this.$emit('blur', e)
    },
    onChange () {
      const mandatory = !!this.isMandatory && this.isMandatory()

      if (!this.disabled && (!this.isActive || !mandatory)) {
        this.$emit('change', this.value)
      }
    }
  },

  render (h) {
    return h('div', this.computedData, [
      this.genRadio(),
      this.genLabel()
    ])
  }
}
