<template v-slot:modal-header="{ close }" title="Advanced Settings">
  <b-form @submit.prevent="submit">
    <div
      class="px-0 px-sm-3 pb-3 d-flex flex-column justify-content-between w-100"
    >
      <h3 class="mt-1">Advanced Settings</h3>
      <b-alert variant="warning" show class="mb-3">
        <small>
          Be careful when changing the settings below as they may cause issues 
          with other apps on your Umbrel that connect to your Monero node. Only make 
          changes if you understand the potential effects on connected apps or 
          wallets.
        </small>
      </b-alert>

      <b-overlay :show="isSettingsDisabled" rounded="sm">
        <div
          class="advanced-settings-container d-flex flex-column p-3 pb-sm-3 bg-light mb-2"
        >

          <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="tor">
                  <p class="font-weight-bold mb-0">Outgoing Connections to Tor Peers</p>
                </label>
              </div>
              <div>
                <toggle-switch
                  id="tor"
                  class="align-self-center"
                  :on="settings.tor"
                  @toggle="status => (settings.tor = status)"
                ></toggle-switch>
              </div>
            </div>
            <small class="w-sm-75 d-block text-muted mt-1">
              Connect to peers available on the Tor network.
            </small>
          </div>

          <hr class="advanced-settings-divider" />

          <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="I2P">
                  <p class="font-weight-bold mb-0">Outgoing Connections to I2P Peers</p>
                </label>
              </div>
              <div>
                <toggle-switch
                  id="I2P"
                  class="align-self-center"
                  :on="settings.i2p"
                  @toggle="status => (settings.i2p = status)"
                ></toggle-switch>
              </div>
            </div>
            <small class="w-sm-75 d-block text-muted mt-1">
              Connect to peers available on the I2P network.
            </small>
          </div>

          <hr class="advanced-settings-divider" />

          <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="allow-incoming-connections">
                  <p class="font-weight-bold mb-0">Incoming Connections</p>
                </label>
              </div>
              <div>
                <toggle-switch
                  id="allow-incoming-connections"
                  class="align-self-center"
                  :on="settings.incomingConnections"
                  @toggle="status => (settings.incomingConnections = status)"
                ></toggle-switch>
              </div>
            </div>
            <small class="w-sm-75 d-block text-muted mt-1">
              Broadcast your node to the Monero network to help other nodes 
              access the blockchain. You may need to set up port forwarding on 
              your router to allow incoming connections from clearnet-only peers.
            </small>
          </div>

          <hr class="advanced-settings-divider" />

          <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="prune-old-blocks">
                  <p class="font-weight-bold mb-0">Prune Blocks</p>
                </label>
              </div>
              <div>
                <toggle-switch
                  id="prune-old-blocks"
                  class="align-self-center"
                  :on="settings.prune"
                  @toggle="status => (settings.prune = status)"
                ></toggle-switch>
              </div>
            </div>
            <small class="w-sm-75 d-block text-muted mt-1">
              Save storage space by pruning (deleting) old blocks and keeping only 
              a limited copy of the blockchain. It may take some time for your 
              node to be online after you turn on pruning. If you turn off pruning 
              after turning it on, you'll need to download the entire blockchain 
              again.
            </small>
          </div>

          <hr class="advanced-settings-divider" />


          <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="dbSyncMode">
                  <p class="font-weight-bold mb-0">DB Sync Mode</p>
                </label>
              </div>
              <div class="">
                <b-form-select
                  id="dbSyncMode"
                  v-model="settings.dbSyncMode"
                  :options="dbSyncMode"
                ></b-form-select>
              </div>
            </div>
            <small class="w-sm-75 d-block text-muted mt-1">
              Configure database synchronization mode for your node.
              Adjusting these settings can help you optimize the performance of your Monero node, 
              particularly during the initial blockchain synchronization and ongoing block validation.
            </small>
          </div>

          <hr class="advanced-settings-divider" />
        
          <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="network">
                  <p class="font-weight-bold mb-0">Network</p>
                </label>
              </div>

              <div>
                <b-form-select
                  id="network"
                  v-model="settings.network"
                  :options="networks"
                ></b-form-select>
              </div>
            </div>
          </div>
          <small class="w-sm-75 d-block text-muted mt-1">
            Choose which network you want your Monero node to connect to. 
            If you change the network, restart your Umbrel to make sure any 
            apps connected to your Monero node continue to work properly.
          </small>
        </div>
      
          
          <!-- <div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-75">
                <label class="mb-0" for="reindex-blockchain">
                  <p class="font-weight-bold mb-0">Reindex Blockchain</p>
                </label>
              </div>
              <div>
                <toggle-switch
                  id="reindex-blockchain"
                  class="align-self-center"
                  :on="settings.reindex"
                  @toggle="status => (settings.reindex = status)"
                ></toggle-switch>
              </div>
            </div>
            <small class="w-sm-75 d-block text-muted mt-1">
              Rebuild the database index used by your Monero node. This can 
              be useful if the index becomes corrupted.
            </small>
          </div>

          <hr class="advanced-settings-divider" /> -->

          
        <!-- template overlay with empty div to show an overlay with no spinner -->
        <template #overlay>
          <div></div>
        </template>
      </b-overlay>

      <b-alert variant="warning" :show="showOutgoingConnectionsError" class="mt-2" @dismissed="showOutgoingConnectionsError=false">
        <small>
          Please choose at least one source for outgoing connections (Clearnet, Tor, or I2P).
        </small>
      </b-alert>

      <div class="mt-2 mb-2">
        <b-row>
          <b-col cols="12" lg="6">
            <b-button @click="clickRestoreDefaults" class="btn-border" variant="outline-secondary" block :disabled="isSettingsDisabled">
              Restore Default Settings</b-button
            >
          </b-col>
          <b-col cols="12" lg="6">
            <b-button class="mt-2 mt-lg-0" variant="success" type="submit" block :disabled="isSettingsDisabled">
              Save and Restart Monero Node</b-button
            >
          </b-col>
        </b-row>
      </div>
    </div>
  </b-form>
</template>

<script>
import cloneDeep from "lodash.clonedeep";

import { mapState } from "vuex";
import ToggleSwitch from "./Utility/ToggleSwitch.vue";

export default {
  data() {
    return {
      settings: {},
      dbSyncMode: [
        { value: "fastest", text: "fastest" },
        { value: "fast", text: "fast" },
        { value: "safe", text: "safe" }
      ],
      networks: [
        { value: "mainnet", text: "mainnet" },
        { value: "test", text: "testnet" },
        { value: "stagenet", text: "stagenet" }
      ],
      showOutgoingConnectionsError: false
    };
  },
  computed: {
    ...mapState({
      moneroConfig: state => state.user.moneroConfig,
      rpc: state => state.monero.rpc,
      p2p: state => state.monero.p2p
    }),
  },
  props: {
    isSettingsDisabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.setSettings();
  },
  components: {
    ToggleSwitch
  },
  methods: {
    submit() {
      this.showOutgoingConnectionsError = false;
      if (!this.isOutgoingConnectionsValid()) return this.showOutgoingConnectionsError = true;
      this.$emit("submit", this.settings);
    },
    clickRestoreDefaults() {
      if (window.confirm("Are you sure you want to restore the default settings?")) {
        this.$emit("clickRestoreDefaults");
      }
    },
    setSettings() {
      // deep clone moneroConfig in order to properly reset state if user hides modal instead of clicking the save and restart button
      this.settings = cloneDeep(this.moneroConfig);
    },
    isOutgoingConnectionsValid() {
      return this.settings.tor || this.settings.i2p;
    }
  }
};
</script>

<!-- removed scoped in order to place scrollbar on bootstrap-vue .modal-body. Increased verbosity on other classes-->
<style lang="scss">
.advanced-settings-container {
  border-radius: 1rem;
  .advanced-settings-divider {
    // same styles as bootstrap <b-dropdown-divider/>
    height: 0;
    margin: 1.25rem 0;
    overflow: hidden;
    border-top: 1px solid #e9ecef;
  }
  .advanced-settings-input {
    max-width: 75px;
  }
  // to remove arrows on number input field
  .advanced-settings-input::-webkit-outer-spin-button, .advanced-settings-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .advanced-settings-input[type="number"] {
    -moz-appearance: textfield;
  }
}

.btn-border {
  border: solid 1px !important;
}

.modal-body::-webkit-scrollbar {
  width: 5px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
  margin-block-end: 1rem;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

/* sm breakpoint */
@media (min-width: 576px) {
  .w-sm-75 { 
    width: 75% !important;
  }
}
</style>
