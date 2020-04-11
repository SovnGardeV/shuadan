<template>
  <input type="text" class="input">
</template>

<script>
export default {
  name: 'TestInput'
}
</script>

<style scoped lang="scss">
.input {
	display: block;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
	padding: 0 15px;
	box-sizing: border-box;
	border-radius: 4px;
	border: none;
	color: #000;
	background: #f9fafb;
	box-shadow:
		-1px -1px 4px 0px rgba( 255, 255, 255, 0.4),
		-2px -2px 8px 0px rgba( 255, 255, 255, 0.4),

		inset 2px 2px 2px 2px rgba( 12,13,18, 0.04),
		inset 4px 4px 4px 2px rgba( 12,13,18, 0.04),
		1px 1px 4px 0px rgba( 12,13,18, 0.04),
		2px 2px 8px 0px rgba( 12,13,18, 0.04)
        ;
    &:focus{
        outline: none;
    }
}
</style>
