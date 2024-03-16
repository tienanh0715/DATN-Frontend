import { init } from "@rematch/core"
import immerPlugin from "@rematch/immer"
import selectPlugin from "@rematch/select"
import persistPlugin from "@rematch/persist"
import storage from "redux-persist/lib/storage"
import {models} from "../models"

const persistConfig = {
    key: "root3",
    storage,
  }
  
const store = init({
     models,
     plugins:[immerPlugin(), selectPlugin(), persistPlugin(persistConfig)]
})

export default store