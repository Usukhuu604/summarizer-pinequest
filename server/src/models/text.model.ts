import { Schema, model } from 'mongoose';

interface IText {
  content: string;
}

const textSchema = new Schema<IText>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Text = model<IText>('Text', textSchema);

export default Text;
