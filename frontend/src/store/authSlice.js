import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSettings, saveSettings } from "../utils/firebase";


export const blockUser = createAsyncThunk('auth/blockUser', (data, action) => {
    const currentUser = action.getState().auth.currentUser;
    return saveSettings(currentUser, data).then(results => {
        console.log('data fetch from blocked', results)
        return data;
    })
})

export const fetchBlocked = createAsyncThunk('auth/fetchBlocked', (user) => {
    return fetchSettings(user).then(results => {
        return results.docs ? results.docs.map(doc => doc.data().blocked) : []
    })
})

const removeFromArray = (arr, value) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: {},
        blocked: [

        ],
        loading: false
    },
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(blockUser.fulfilled, (state, action) => {
            const currentUserId = action.payload.user.sub || action.payload.user.user_id;
            if (action.payload.blocked) {
                state.blocked = removeFromArray([...state.blocked], currentUserId);
            } else {   
                if (!(currentUserId in state.blocked)) {
                    state.blocked.push(currentUserId);
                }
            }
            state.loading = false
        });
        builder.addCase(blockUser.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchBlocked.fulfilled, (state, action) => {
            state.blocked = action.payload
        })
    }
})

export default authSlice