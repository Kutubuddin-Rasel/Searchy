import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    slug:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true
    },
    description:{
        type:String,
        trim:true
    },
    parent:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        default:null,
        index:true
    },
    path:{
        type:String,
        required:true,
        index:true
    },
    level:{
        type:Number,
        required:true,
        default:0,
        min:0
    },
    image:{
        type:String
    },
    icon:{
        type:String
    },
    order:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true,
        index:true
    },
    productCount:{
        type:Number,
        default:0,
        min:0
    }
},{timestamps:true})

categorySchema.pre('save', async function(next){
    if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    }

    if(this.parent){
        const parentCategory = await mongoose.model('Category').findById(this.parent);
        if(parentCategory){
            this.path = `${parentCategory.path}/${this.slug}`;
            this.level = parentCategory.level +1;
        }
        else{
            this.path = `/${this.slug}`;
            this.level = 0;
        }
    }
    next();
})

categorySchema.index({ path: 1, isActive: 1 });
categorySchema.index({ parent: 1, order: 1 });

categorySchema.methods.getChildren = async function(){
    return await mongoose.model('Category').find({ parent: this._id });
}

categorySchema.methods.getSubtree = async function() {
  const regex = new RegExp(`^${this.path}`);
  return await mongoose.model('Category').find({ path: regex, isActive: true });
};

export const Category = mongoose.model("Category", categorySchema);