import mongoose from "mongoose";
const { Schema, model } = mongoose;

const StencilSchema = new Schema({
  label: {
    type: String,
    required: [true, "Stencil should have a label"],
  },
  screenSize: {
    type: String,
    required: [true, "Stencil should have a screen size"],
  },
  prl: {
    type: String,
    required: [true, "Stencil should have a screen PRL"],
  },
  type: {
    type: String,
    required: [true, "Stencil should have a screen tape"],
  },
  itemName: {
    type: String,
    required: [true, "Stencil should have a name"],
  },
  items: [
    {
      width: {
        type: Number,
        required: [true, "Stencil should have a width"],
      },
      height: {
        type: Number,
        required: [true, "Stencil should have a height"],
      },
      top: {
        type: Number,
        required: [true, "Stencil should have a top position"],
      },
      left: {
        type: Number,
        required: [true, "Stencil should have a left position"],
      },
      color: {
        type: String,
        required: [true, "Stencil should have a color"],
      },
    },
  ],
});

export const Stencil = model("Stencil", StencilSchema);
