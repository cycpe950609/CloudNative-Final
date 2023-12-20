package com.example.courtreservation.ui.friend_list

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.courtreservation.FragmentSwitchListener
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentFriendListBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.ui.login.LoginActivity
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson


data class friendinfo(
    val user_id: Int,
    val user_name: String
)
class FriendListFragment:Fragment() {
    private var _binding: FragmentFriendListBinding? = null
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/friendlist/"


    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFriendListBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val linearLayoutContainer: LinearLayout = root.findViewById(R.id.friend_list)
        var username = LoginActivity.Usersingleton.username

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                val listType = object : TypeToken<List<friendinfo>>() {}.type

                val stringsList: List<friendinfo> = Gson().fromJson(jsonResult, listType)
                println(stringsList)

                for(i in stringsList.indices){
                    val listElement = inflater.inflate(R.layout.friend_list_element, linearLayoutContainer, false)

                    var ele_name = listElement.findViewById<TextView>(R.id.custom_view_text)

                    ele_name.text = stringsList[i].user_name

                    listElement.setOnTouchListener { view, motionEvent ->
                        when (motionEvent.action) {
                            MotionEvent.ACTION_DOWN -> {
                                // 缩小动画
                                view.animate().scaleX(0.95f).scaleY(0.95f).setDuration(200).start()
                                true
                            }
                            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                                // 放大回原大小的动画
                                view.animate().scaleX(1f).scaleY(1f).setDuration(200).start()
                                var act = activity as FragmentSwitchListener
                                act.replaceFragmentWithArgs(R.id.nav_friend_info,stringsList[i].user_id.toString())
                                true
                            }
                            else -> false
                        }
                    }
                    linearLayoutContainer.addView(listElement)
                }
            } else {
                null
            }
        }

        fetchMenuTask.execute(url + username)

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}