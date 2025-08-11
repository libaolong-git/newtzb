<template>
  <div 
    :class="[
      'bg-gradient-to-r from-primary-green to-accent-green rounded-xl flex items-center justify-center shadow-lg',
      sizeClasses
    ]"
  >
    <svg 
      :class="iconSizeClasses" 
      class="text-white" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'GovIcon',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    }
  },
  computed: {
    sizeClasses() {
      const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
      }
      return sizes[this.size]
    },
    iconSizeClasses() {
      const iconSizes = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-7 h-7',
        xl: 'w-8 h-8'
      }
      return iconSizes[this.size]
    }
  }
}
</script>