import { InputType, Field, Float } from 'type-graphql';

@InputType()
export class ProductInput {
    @Field() title!: string;
    @Field() description!: string;
    @Field(() => Float) price!: number;
    @Field() category!: string;
    @Field() imageUrl!: string;
    @Field() inStock!: boolean;
}
