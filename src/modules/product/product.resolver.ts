import { FindOptionsWhere, Like } from 'typeorm';
import { Product } from './models/product.entity';
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_DEL_FAIL,
  PRODUCT_NOT_EXIST,
  PRODUCT_UPDATE_FAIL,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import {
  ProductResult,
  ProductResults,
  ProductTypeResults,
} from './dto/result-product.output';
import { PartialProductInput } from './dto/product.input';
import { ProductType } from './dto/product.type';
import { ProductService } from './product.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { PageInput } from '@/common/dto/page.input';
import { PRODUCT_TYPES } from '@/common/constants/product-types';

@Resolver(() => ProductType)
@UseGuards(GqlAuthGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  /**
   * 获取商品分类数据
   * 商品分类数据存在代码中
   * @returns
   */
  @Query(() => ProductTypeResults)
  async getProductTypes(): Promise<ProductTypeResults> {
    return {
      code: SUCCESS,
      data: PRODUCT_TYPES,
      message: '获取成功',
    };
  }

  @Query(() => ProductResult)
  async getProductInfo(@Args('id') id: string): Promise<ProductResult> {
    const result = await this.productService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: '获取成功',
      };
    }
    return {
      code: PRODUCT_NOT_EXIST,
      message: '商品信息不存在',
    };
  }

  @Mutation(() => ProductResult)
  async commitProductInfo(
    @Args('params') params: PartialProductInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<Result> {
    if (!id) {
      const res = await this.productService.create({
        ...params,
        createdBy: userId,
        cards: [],
        org: {
          id: orgId,
        },
      });
      if (res) {
        return {
          code: SUCCESS,
          message: '创建成功',
        };
      }
      return {
        code: PRODUCT_CREATE_FAIL,
        message: '创建失败',
      };
    }
    const product = await this.productService.findById(id);
    if (product) {
      const newProduct = {
        ...params,
        cards: [],
        updatedBy: userId,
      };
      if (params.cards && params.cards.length > 0) {
        // 修改对象是一个数组，数组里面是卡片对象
        newProduct.cards = params.cards.map((childId) => ({
          id: childId,
        }));
      }
      const res = await this.productService.updateById(product.id, newProduct);
      if (res) {
        return {
          code: SUCCESS,
          message: '更新成功',
        };
      }
      return {
        code: PRODUCT_UPDATE_FAIL,
        message: '更新失败',
      };
    }
    return {
      code: PRODUCT_NOT_EXIST,
      message: '商品信息不存在',
    };
  }

  @Query(() => ProductResults)
  async getProducts(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<ProductResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Product> = { createdBy: userId };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (orgId) {
      where.org = {
        id: orgId,
      };
    }
    const [results, total] = await this.productService.findProducts({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: '获取成功',
    };
  }

  @Mutation(() => Result)
  async deleteProduct(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.productService.findById(id);
    if (result) {
      const delRes = await this.productService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: '删除成功',
        };
      }
      return {
        code: PRODUCT_DEL_FAIL,
        message: '删除失败',
      };
    }
    return {
      code: PRODUCT_NOT_EXIST,
      message: '商品信息不存在',
    };
  }

  @Query(() => ProductResults)
  async getProductsForH5(
    @Args('page') page: PageInput,
    @Args('type', { nullable: true }) type?: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<ProductResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Product> = {};
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (type) {
      where.type = Like(`%${type}%`);
    }
    const [results, total] = await this.productService.findProducts({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: '获取成功',
    };
  }
}
