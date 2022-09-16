<template>
  <div class="paging mt40">
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.pageNo"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageSizes"
        :total="pageInfo.totalCount"
        :layout="layout"
        :pager-count="pagerCount"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Vue, Prop, State, Mutation } from "nuxt-property-decorator";
import { IPageInfoModel } from "@/models/common-model";
@Component({ name: "Pagination" })
export default class extends Vue {
  @Prop({ default: { pageNo: 1, totalCount: 0, pageSize: 10 } })
  pageInfo!: IPageInfoModel;

  @Prop({ default: () => [10, 20, 30, 50, 100], type: Array })
  pageSizes!: number[];
  
  @Prop({ default: () => "total, sizes, prev, pager, next, jumper" })
  layout! : string

  @Prop({ default: () => 5 })
  pagerCount! : number

  handleSizeChange(newSize) {
    const newValue = {
      pageSize: newSize,
      pageNo: newSize <= this.pageInfo.totalCount ? 1 : this.pageInfo.pageNo,
    };
    this.$emit("pagination", Object.assign(this.pageInfo, newValue));
  }
  handleCurrentChange(newPage) {
    this.$emit("pagination", Object.assign(this.pageInfo, { pageNo: newPage }));
  }
}
</script>
