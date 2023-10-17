<template v-slot:modal-body>
  <div class="text-center">
    <qr-code
      :value="`xmr:${address}`"
      :size="120"
      class="qr-image mx-auto mt-1"
      showLogo
      @click="copyAddress"
      ref="qrCode"
    ></qr-code>
    <div ref="address" class="d-none">{{ address }}</div>
    <div ref="tooltip" class="tooltip fade" role="tooltip">
      <div class="tooltip-arrow"></div>
      <div class="tooltip-inner">
        Copied!
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @media (min-width: 576px) {
    .w-sm-75 { 
      width: 75% !important;
    }
  }
</style>

<script>
  import QrCode from "@/components/Utility/QrCodeMonero";
  export default {
    name: "DonationModal",
    props: {
      address: {
        type: String,
        default: '86PKfN1ExxVe1FH2x7kTeuAtieZRAErbU1gV4qDkrpMKVNcfgAi8Dqz9oXhWCdCEcK6iqgxzdM6GZPCjVejAQ2dtQkWPyXv',
      },
    },
    methods: {
      copyAddress() {
        const address = this.$refs.address.textContent;
        navigator.clipboard.writeText(address);
        const tooltip = this.$refs.tooltip;
        const qrCode = this.$refs.qrCode.$el;
        tooltip.classList.add("show");
        tooltip.style.top = `${qrCode.offsetTop - tooltip.offsetHeight}px`;
        tooltip.style.left = `${qrCode.offsetLeft + qrCode.offsetWidth / 2 - tooltip.offsetWidth / 2}px`;
        setTimeout(() => {
          tooltip.classList.remove("show");
        }, 250);
      },
    },
    components: {
      QrCode,
    },
  };
</script>