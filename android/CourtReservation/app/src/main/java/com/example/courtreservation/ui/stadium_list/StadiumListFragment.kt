package com.example.courtreservation.ui.stadium_list

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentStadiumListBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.FragmentSwitchListener
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson

class StadiumListFragment: Fragment() {
    private var _binding: FragmentStadiumListBinding? = null
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/stadium_name"
    private val url2 = "https://cloudnative.eastasia.cloudapp.azure.com/app/stadium/"

    private val binding get() = _binding!!

    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentStadiumListBinding.inflate(inflater,container,false)
        var root = binding.root

        val linearLayoutContainer: LinearLayout = root.findViewById(R.id.stadium_list)

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                val listType = object : TypeToken<List<String>>() {}.type

                val stringsList: List<String> = Gson().fromJson(jsonResult, listType)
                println(stringsList)

                for(i in stringsList.indices){
                    val listElement = inflater.inflate(R.layout.list_element, linearLayoutContainer, false)

                    var ele_img = listElement.findViewById<ImageView>(R.id.custom_view_image)
                    var ele_title = listElement.findViewById<TextView>(R.id.custom_view_text)
                    Glide.with(this /* context */)
                        .load(url2 + stringsList[i])
                        .into(ele_img)
                    ele_title.text = stringsList[i]

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
                                act.replaceFragmentWithArgs(R.id.nav_court,stringsList[i])
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

        fetchMenuTask.execute(url)

        return root
    }
}