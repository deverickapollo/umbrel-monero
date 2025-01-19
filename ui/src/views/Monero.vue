<template>
  <div class="pt-2 pt-md-4 pb-4 px-2">
    <div class="my-3 pb-2">
      <div
        class="d-flex flex-wrap justify-content-between align-items-center mb-2"
      >
        <div
          class="d-flex flex-grow-1 justify-content-start align-items-start mb-3"
        >
          <img
            class="app-icon me-2 me-sm-3"
            src="@/assets/community-monero-icon.svg"
          />
          <div>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="4"
                cy="4"
                r="4"
                :fill="`${isMoneroCoreOperational ? '#00CD98' : '#F6B900'}`"
              />
            </svg>
            <small v-if="isMoneroCoreOperational" class="ms-1 text-success"
              >Running</small
            >
            <small v-else class="ms-1 text-warning">Starting</small>
            <h3 class="d-block font-weight-bold mb-1">Monero Node</h3>
            <span class="d-block text-muted">{{
              version ? `Monero Core ${version}` : "..."
            }}</span>
          </div>
        </div>
        <div
          class="d-flex col-12 col-md-auto justify-content-start align-items-center p-0"
        >
          <!-- TODO - work on responsiveness of connect + settings button -->
          <BButton
            type="button"
            variant="primary"
            class="btn capitalize py-1 ps-2 pe-3 w-100 custom-connect-btn me-3"
            @click="showConnectModal = !showConnectModal"
          >
            <ic-round-plus  />
            Connect
          </BButton>

          <BDropdown
            class="ms-3"
            variant="link"
            toggle-class="text-decoration-none"
            @click="toggleAdvancedSettingsDropdown = !toggleAdvancedSettingsDropdown"
            no-caret
            right
          >
            <template v-slot:button-content>
              <svg
                width="18"
                height="4"
                viewBox="0 0 18 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
                  fill="#6c757d"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2C7 3.10457 7.89543 4 9 4Z"
                  fill="#6c757d"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 4C17.1046 4 18 3.10457 18 2C18 0.89543 17.1046 0 16 0C14.8954 0 14 0.89543 14 2C14 3.10457 14.8954 4 16 4Z"
                  fill="#6c757d"
                />
              </svg>
            </template>
            <BDropdownItem
              @click="showAdvancedSettingsModal = !showAdvancedSettingsModal"
              class="custom-dropdown"
              >
              Advanced Settings</BDropdownItem
            >
          </BDropdown>
        </div>
      </div>
      <BAlert :show="showReindexCompleteAlert" variant="warning"
            >Reindexing is now complete. Turn off "Reindex blockchain" in
            <span
              class="open-settings"
              @click="() => $bvModal.show('advanced-settings-modal')"
              >advanced settings</span
            >
            to prevent reindexing every time Monero Node restarts.</BAlert
          >

      <BAlert :show="showReindexInProgressAlert" variant="info"
        >Reindexing in progress...</BAlert
      >

      <BAlert
        :show="showRestartError"
        variant="danger"
        dismissible
        @dismissed="showRestartError = false"
      >
        Something went wrong while attempting to change the configuration of
        Monero Node.
      </BAlert>
    </div>
    <BRow class="row-eq-height">
      <BCol cols="12" md="5" lg="4">
        <card-widget
          header="Blockchain"
          :loading="syncPercent !== 100 || blocks.length === 0"
        >
          <div class>
            <div class="px-3 px-lg-4 mb-5">
              <div class="w-100 d-flex justify-content-between mb-2">
                <span class="align-self-end">Synchronized</span>
                <h3 class="font-weight-normal mb-0">
                  <span v-if="syncPercent !== -1">
                    {{ syncPercent }}
                    <small class>%</small>
                  </span>

                  <span
                    class="loading-placeholder loading-placeholder-lg d-block"
                    style="width: 6rem;"
                    v-else
                  ></span>
                </h3>
              </div>
              <BProgress
                :value="Math.round(syncPercent)"
                class="mb-1"
                variant="success"
                :style="{ height: '4px' }"
              ></BProgress>
              <small
                class="text-muted d-block text-right"
                v-if="currentBlock < blockHeight - 1"
              >
                {{ currentBlock.toLocaleString() }} of
                {{ blockHeight.toLocaleString() }} blocks
              </small>
            </div>
            <p class="px-3 px-lg-4 mb-3 text-muted">Latest Blocks</p>
            <blockchain :numBlocks="5"></blockchain>
          </div>
        </card-widget>
      </BCol>
      <BCol cols="12" md="7" lg="8">
        <card-widget class="overflow-x" :header="networkWidgetHeader">
          <div class>
            <div class="px-3 px-lg-4">
              <BRow>
                <BCol cols="6" md="3">
                  <stat
                    title="Connections"
                    :value="stats.peers"
                    :suffix="`${stats.peers === 1 ? 'Peer' : 'Peers'}`"
                    showPercentChange
                    :showPopover="true"
                    popoverId="connections-popover"
                    :popoverContent="[
                      `Clearnet${torProxy ? ' (over Tor)' : ''}: ${
                        peers.clearnet
                      }`,
                      `Tor: ${peers.tor}`,
                      `I2P: ${peers.i2p}`
                    ]"
                  ></stat>
                
                </BCol>
                <BCol cols="6" md="3">
                  <stat
                    title="Mempool"
                    :value="abbreviateSize(stats.mempool)[0]"
                    :suffix="abbreviateSize(stats.mempool)[1]"
                    showPercentChange
                    :showPopover="true"
                    popoverId="mempool-popover"
                    :popoverContent="[
                      `Transaction Count: ${stats.mempoolTransactions}`
                    ]"
                  ></stat>
                </BCol>
                <BCol cols="6" md="3">
                  <stat
                    title="Hashrate"
                    :value="abbreviateHashRate(stats.hashrate)[0]"
                    :suffix="abbreviateHashRate(stats.hashrate)[1]"
                    hasDecimals
                    showPercentChange
                  ></stat>
                </BCol>
                <BCol cols="6" md="3">
                  <stat
                    title="Blockchain Size"
                    :value="abbreviateSize(stats.blockchainSize)[0]"
                    :suffix="abbreviateSize(stats.blockchainSize)[1]"
                    showPercentChange
                  ></stat>
                </BCol>
                <!-- <BCol cols="6" md="2">
                  <stat
                    title="Mining Status"
                    :value="abbreviateSize(stats.blockchainSize)[0]"
                    :suffix="abbreviateSize(stats.blockchainSize)[1]"
                    showPercentChange
                  ></stat>
                </BCol>
                <BCol cols="6" md="2">
                  <stat
                    title="Mining Status"
                    :value="abbreviateSize(stats.blockchainSize)[0]"
                    :suffix="abbreviateSize(stats.blockchainSize)[1]"
                    showPercentChange
                  ></stat>
                </BCol> -->
              </BRow>
            </div>
            <chart-wrapper></chart-wrapper>
          </div> 
        </card-widget>
      </BCol>
    </BRow>
    <BModal v-model="showConnectModal" size="lg" centered hide-footer>
      <connection-modal></connection-modal>
    </BModal>

    <BModal
      v-model="showAdvancedSettingsModal"
      size="lg"
      centered
      hide-footer
      scrollable
    >
      <advanced-settings-modal
        :isSettingsDisabled="isRestartPending"
        @submit="saveSettingsAndRestartMonero"
        @clickRestoreDefaults="restoreDefaultSettingsAndRestartMonero"
        @clickResetPassword="restoreRPCPassword"
      ></advanced-settings-modal>
    </BModal>
  </div>
</template>

<script>
// import Vue from "vue";
import { mapState } from "vuex";

import API from "@/helpers/api";
import delay from "@/helpers/delay";

import CardWidget from "@/components/CardWidget.vue";
import Blockchain from "@/components/Blockchain.vue";
import Stat from "@/components/Utility/Stat.vue";
import ConnectionModal from "@/components/ConnectionModal.vue";
import AdvancedSettingsModal from "@/components/AdvancedSettingsModal.vue";
import ChartWrapper from "@/components/ChartWrapper.vue";

export default {
  data() {
    return {
      isRestartPending: false,
      showRestartError: false,
      showConnectModal: false,
      showAdvancedSettingsModal: false
    };
  },
  computed: {
    ...mapState({
      isMoneroCoreOperational: state => state.monero.operational,
      syncPercent: state => state.monero.percent,
      blocks: state => state.monero.blocks,
      version: state => state.monero.version,
      currentBlock: state => state.monero.currentBlock,
      blockHeight: state => state.monero.blockHeight,
      stats: state => state.monero.stats,
      peers: state => state.monero.peers,
      mining: state => state.monero.mining,
      rpc: state => state.monero.rpc,
      p2p: state => state.monero.p2p,
      reindex: state => state.user.moneroConfig.reindex,
      network: state => state.user.moneroConfig.network,
      pruned: state => state.monero.pruned
    }),
    showReindexInProgressAlert() {
      return this.reindex && this.syncPercent !== 100 && !this.isRestartPending;
    },
    showReindexCompleteAlert() {
      return this.reindex && this.syncPercent === 100 && !this.isRestartPending;
    },
    networkWidgetHeader() {
      if (!this.network || this.network === "main") return "Network";
      if (this.network === "test") return "Network (testnet)";
      return `Network (${this.network})`;
    }
  },
  methods: {
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    abbreviateHashRate(n) {
      if (n < 1e3) return [Number(n.toFixed(1)), "H/s"];
      if (n >= 1e3 && n < 1e6) return [Number((n / 1e3).toFixed(1)), "kH/s"];
      if (n >= 1e6 && n < 1e9) return [Number((n / 1e6).toFixed(1)), "MH/s"];
      if (n >= 1e9 && n < 1e12) return [Number((n / 1e9).toFixed(2)), "GH/s"];
      if (n >= 1e12 && n < 1e15) return [Number((n / 1e12).toFixed(1)), "TH/s"];
      if (n >= 1e15 && n < 1e18) return [Number((n / 1e15).toFixed(1)), "PH/s"];
      if (n >= 1e18 && n < 1e21) return [Number((n / 1e18).toFixed(1)), "EH/s"];
      if (n >= 1e21) return [Number(+(n / 1e21).toFixed(1)), "ZH/s"];
    },
    abbreviateSize(n) {
      if (n < 1e3) return [Number(n.toFixed(1)), "Bytes"];
      if (n >= 1e3 && n < 1e6) return [Number((n / 1e3).toFixed(1)), "KB"];
      if (n >= 1e6 && n < 1e9) return [Number((n / 1e6).toFixed(1)), "MB"];
      if (n >= 1e9 && n < 1e12) return [Number((n / 1e9).toFixed(1)), "GB"];
      if (n >= 1e12 && n < 1e15) return [Number((n / 1e12).toFixed(1)), "TB"];
      if (n >= 1e15) return [Number(+(n / 1e15).toFixed(1)), "PB"];
    },
    fetchStats() {
      try {
        this.$store.dispatch("monero/getStats");
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    },
    fetchMiningData(){
      try {
        this.$store.dispatch("monero/mining");
      } catch (error) {
        console.error("Error fetching mining data:", error);
      }
    },
    fetchPeers() {
      try {
        this.$store.dispatch("monero/getPeers");
      } catch (error) {
        console.error("Error fetching peers:", error);
      }
    },
    fetchConnectionDetails() {
      try {
        return Promise.all([
          this.$store.dispatch("monero/getP2PInfo"),
          this.$store.dispatch("monero/getRpcInfo")
        ]);
      } catch (error) {
        console.error("Error fetching connection details:", error);
      }
    },
    fetchMoneroConfigSettings() {
      try {
        this.$store.dispatch("user/getMoneroConfig");
      } catch (error) {
        console.error("Error fetching Monero config settings:", error);
      }
    },
    async saveSettingsAndRestartMonero(moneroConfig) {
      try {
        this.isRestartPending = true;
        this.$store.dispatch("user/updateMoneroConfig", moneroConfig);

        const response = await API.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/system/update-monero-config`,
          { moneroConfig }
        );

        if (response.data.success) {
          // reload the page to reset all state and show loading view while monero core restarts.
          this.$router.push({ query: { restart: "1" } });
          window.location.reload();
        } else {
          this.fetchMoneroConfigSettings();
          this.showRestartError = true;
          this.isRestartPending = false;
        }
      } catch (error) {
        console.error(error);
        this.fetchMoneroConfigSettings();
        this.showRestartError = true;
        this.$bvModal.hide("advanced-settings-modal");
        this.isRestartPending = false;
      }
    },
    // Restore default settings and restart Monero
    async restoreDefaultSettingsAndRestartMonero() {
      try {
        this.isRestartPending = true;

        const response = await API.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/system/restore-default-monero-config`
        );

        // dispatch getMoneroConfig after post request to avoid referencing default values in the store.
        this.$store.dispatch("user/getMoneroConfig");

        if (response.data.success) {
          // reload the page to reset all state and show loading view while monero core restarts.
          this.$router.push({ query: { restart: "1" } });
          window.location.reload();
        } else {
          this.fetchMoneroConfigSettings();
          this.showRestartError = true;
          this.isRestartPending = false;
        }
      } catch (error) {
        console.error(error);
        this.fetchMoneroConfigSettings();
        this.showRestartError = true;
        this.$bvModal.hide("advanced-settings-modal");
        this.isRestartPending = false;
      }
    },
    // Restore RPC password
    async restoreRPCPassword(){
      try {
        const response = await API.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/system/reset-rpc-password`
        );

        if (response.data.success) {
            // reload the page to reset all state and show loading view while monero core restarts.
            this.$router.push({ query: { restart: "1" } });
            window.location.reload();
        } else {
          this.fetchMoneroConfigSettings();
          this.showRestartError = true;
          this.isRestartPending = false;
        }
      } catch (error) {
        console.error(error);
        this.showRestartError = true;
        this.$bvModal.hide("advanced-settings-modal");
        this.isRestartPending = false;
      }
    }
  },
  async created() {
    // fetch settings first because monero core
    // is not operational if pruning is in progress
    this.fetchMoneroConfigSettings();

    // wait until monero is operational
    while (true) { /* eslint-disable-line */
      await this.$store.dispatch("monero/getStatus");
      if (this.isMoneroCoreOperational) {
        break;
      }
      await delay(1000);
    }
    this.$store.dispatch("monero/getVersion");
    this.fetchStats();
    this.fetchPeers();
    this.fetchConnectionDetails();
    // this.miningInterval = window.setInterval(() => {
    //   this.fetchMiningData();
    // }, 15000)
    this.interval = window.setInterval(() => {
      this.fetchStats();
      this.fetchPeers();
    }, 5000);
  },
  beforeDestroy() {
    if (this.interval) {
      window.clearInterval(this.interval);

    }
    // if (this.miningInterval) {
    //   window.clearInterval(this.miningInterval);
    // }
  },
  components: {
    CardWidget,
    Blockchain,
    Stat,
    ConnectionModal,
    AdvancedSettingsModal,
    ChartWrapper
  }
};
</script>

<style lang="scss">
.app-icon {
  height: 120px;
  width: 120px;
  border-radius: 22%;
}
.overflow-x {
  overflow-x: visible;
}

.dropdown-menu {
  margin-top: 0.5rem;
  padding: 4px 0;
  border-radius: 4px;
}

.dropdown-item {
  padding-top: 8px;
  padding-bottom: 8px;
}

.open-settings {
  text-decoration: underline;
}

.open-settings:hover {
  cursor: pointer;
}
</style>
