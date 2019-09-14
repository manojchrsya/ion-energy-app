<template>
  <div>
    <v-container
      fluid
      grid-list-xl>
      <v-layout
        row
        wrap />
      <v-flex lg12>
        <v-card>
          <v-card-text>
            <v-container fluid grid-list-sm>
              <v-layout wrap>
                <v-flex
                  lg12
                  sm12>
                  <v-card
                    color="primary"
                    dark>
                    <v-responsive>
                      <e-chart
                        ref="chart"
                        :path-option="[
                          ['dataset.source', formatDetails(graphDetails)],
                          ['grid.bottom', '10%'],
                          ['grid.top', '5%'],
                          ['grid.left', '1%'],
                          ['grid.right', '2%'],
                          ['xAxis.show', true],
                          ['yAxis.show', true],
                          ['series[0].type', 'bar'],
                          ['series[0].barGap', '-100%'],
                          ['series[0].itemStyle.normal.color', '#fff'],
                          ['series[0].barWidth', '50%'],
                          ['series[1].barWidth', '50%'],
                          ['series[1].type', 'bar'],
                          ['series[1].itemStyle.normal.color', 'rgba(0,0,0,0)'],
                        ]"
                        height="300px"
                        width="100%"
                      />
                    </v-responsive>
                  </v-card>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-flex>
                <template slot="activator">
                  <input
                    type="file"
                    ref="file"
                    @change="uploadFile(this)"
                  >
                </template>
              </v-flex>
              <v-flex
                shrink
                class="pa-0 ma-0">
                <v-btn
                  color="primary"
                  @click="openFileDialoge()">
                  Upload File
                </v-btn>
              </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash';
import EChart from '@/components/chart/echart';

import {
  required,
  numeric,
  minLength,
  maxLength,
  email,
} from 'vuelidate/lib/validators';
const mobileRegex = /^[6789]\d{9}$/;

export default {
  components: {
    EChart,
  },
  data: () => ({
    search: '',
    graphDetails: [],
  }),
  async asyncData({ app }) {
    try {
      const graphDetails = await app.$axios.get('getDetails');
      return { graphDetails : graphDetails.data };
    } catch (error) {
      return { graphDetails: [] };
    }
  },
  methods: {
    openFileDialoge(vehicleType) {
      this.$refs.file.click();
    },
    async uploadFile() {
      try {
        const formData = new FormData();
        formData.append('file', this.$refs.file.files[0]);
        // eslint-disable-next-line no-unused-vars
        const response = await this.$axios.post(`/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        window.getApp.$emit('SHOW_SUCCESS_MESSAGE', { message: response.data.message });
        // reset the input type file
        this.$refs.file.type = 'text';
        this.$refs.file.type = 'file';
      } catch(error) {
        window.getApp.$emit('SHOW_ERROR_MESSAGE', { message: error.message });
      }
    },
    formatDetails() {
      const records = [];
      for (let i = 0; i < this.graphDetails.length ; i++) {
        const timestamp = this.$moment.unix(this.graphDetails[i].ts / 1000).format('dddd, MMMM Do, YYYY h:mm:ss');
        records.push({ timestamp, value: this.graphDetails[i].val});
      }
      return records;
    },
  },
};
</script>

