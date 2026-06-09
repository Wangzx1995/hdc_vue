<template>
    <svg
        class="svg-icon"
        className="svg-icon"
        aria-hidden="true"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
export default {
    props: {
        iconClass: {
            type: String,
            default: "account-pin-circle-fill",
        },
        width: {
            type: Number,
            default: "16",
        },
        height: {
            type: Number,
            default: "16",
        },
    },
    computed: {
        iconName() {
            return `#icon-${this.iconClass}`;
        },
    },
};
</script>
