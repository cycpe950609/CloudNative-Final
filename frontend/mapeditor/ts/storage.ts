import {
    applyMiddleware,
    configureStore,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import thunkMiddleware, { ThunkDispatch } from "redux-thunk";
import logger from "redux-logger";
import { JsonObjectExpression } from "typescript";
import Mode from "./mode";
import { Color } from "three";

const data = {};

export default data;
