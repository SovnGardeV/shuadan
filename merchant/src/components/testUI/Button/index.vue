<template>
  <button class="button" v-html="content" />
</template>

<script>
export default {
  name: 'TestButton',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.button {
    display: inline-block;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
    padding: 7px 15px;
    margin: 8px;
	font-size: 14px;
	color: rgba(48,52,84, 1);
	border: none;
	border-radius: 4px;
	background-color: #f9fafb;
	cursor: pointer;
	outline: none;
	text-shadow:
		0 -1px 0 rgba( 12,13,18, 0.08 ),
		0 1px 0 rgba( 255, 255, 255, 1 );
	box-shadow:
		inset -1px -1px 1px rgba( 12,13,18, 0.06 ),
		2px 2px 2px rgba( 12,13,18, 0.08),
		4px 4px 6px rgba( 12,13,18, 0.08),
		8px 8px 16px rgba( 12,13,18, 0.08),
		1px 1px 2px rgba( 12,13,18, 0.08);
	-webkit-transition:
		color 0.3s,
		text-shadow 0.3s,
		box-shadow 0.6s;
	transition:
		color 0.3s,
		text-shadow 0.3s,
		box-shadow 0.6s;
    &:hover {
		text-shadow:
			0 -1px 0 rgba( 12,13,18, 0.08 ),
			0 1px 0 rgba( 255, 255, 255, 1 ),
			0 0 1px rgba( 255, 255, 255, 0.7 ),
			0 0 4px rgba( 0,150,255, 0.08 ),
			0 0 8px rgba( 0,150,255, 0.08 );
		box-shadow:
			inset -1px -1px 1px rgba( 12,13,18, 0.06 ),
			3px 3px 3px rgba( 12,13,18, 0.085),
			5px 5px 6px rgba( 12,13,18, 0.085),
			1px 1px 6px rgba( 12,13,18, 0.085),
			1px 1px 4px rgba( 12,13,18, 0.085);
    }
    &:active {
		box-shadow:
			1px 1px 1px rgba( 255, 255, 255, 1 ),
			inset -2px -2px 2px rgba( 255, 255, 255, 0.9),
			inset -3px -3px 4px rgba( 255, 255, 255, 0.9),
			inset -6px -6px 12px rgba( 255, 255, 255, 0.9),
			inset -8px -8px 16px rgba( 255, 255, 255, 0.9),
			-1px -1px 1px rgba( 12,13,18, 0.06 ),
			inset 2px 2px 2px rgba( 12,13,18, 0.08),
			inset 3px 3px 4px rgba( 12,13,18, 0.08),
			inset 6px 6px 12px rgba( 12,13,18, 0.08),
			inset 8px 8px 16px rgba( 12,13,18, 0.08);
	}
}
</style>
