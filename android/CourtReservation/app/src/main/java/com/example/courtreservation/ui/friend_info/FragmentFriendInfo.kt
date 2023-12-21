package com.example.courtreservation.ui.friend_info

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.courtreservation.FragmentSwitchListener
import com.example.courtreservation.databinding.FragmentFriendInfoBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.network.PostDataTask
import com.example.courtreservation.ui.login.LoginActivity
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson
import org.json.JSONObject

data class userinfo(
    val age: Int,
    val gender: String,
    val height: Int,
    val user_id: Int,
    val user_name: String
)

class FragmentFriendInfo:Fragment() {
    private var _binding: FragmentFriendInfoBinding? = null
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/user_info/"
    private val url2 = "https://cloudnative.eastasia.cloudapp.azure.com/app/delete_user"


    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFriendInfoBinding.inflate(inflater, container, false)
        val root: View = binding.root

        var username = LoginActivity.Usersingleton.username
        var user_id = arguments?.getString("args")

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                val listType = object : TypeToken<userinfo>() {}.type

                val friendinfo: userinfo = Gson().fromJson(jsonResult, listType)

                binding.name.text = friendinfo.user_name
                binding.gender.text = friendinfo.gender
                binding.age.text = friendinfo.age.toString()
                binding.height.text = friendinfo.height.toString()

                binding.btn1.setOnClickListener{
                    val jsonBody = JSONObject()
                    jsonBody.put("username1", username)
                    jsonBody.put("username2", friendinfo.user_name)
                    PostDataTask { responseBody, responseCode ->
                        println(responseCode)
                    }.execute(url2, jsonBody.toString())
                    var act = activity as FragmentSwitchListener
                    act.goBack()
                }




            } else {
                null
            }
        }

        fetchMenuTask.execute(url + user_id)

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}