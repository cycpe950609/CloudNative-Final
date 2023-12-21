package com.example.courtreservation.ui.announcement_list

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
import com.example.courtreservation.databinding.FragmentAnnouncementListBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.ui.friend_list.friendinfo
import com.example.courtreservation.ui.login.LoginActivity
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class announcement(
    val announcement_id: Int,
    val content: String,
    val end_date: String,
    val start_date: String,
    val title: String,
    val writer_id: Int
)
class AnnouncementListFragment:Fragment() {
    private var _binding: FragmentAnnouncementListBinding? = null
    private val binding get() = _binding!!

    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/announcement"
    @SuppressLint("MissingInflatedId", "ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentAnnouncementListBinding.inflate(inflater, container, false)
        var root = binding.root

        val linearLayoutContainer: LinearLayout = root.findViewById(R.id.announcement_list)

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                val listType = object : TypeToken<List<announcement>>() {}.type

                val stringsList: List<announcement> = Gson().fromJson(jsonResult, listType)
                println(stringsList)

                for(i in stringsList.indices){
                    val listElement = inflater.inflate(R.layout.announcement_list_element, linearLayoutContainer, false)

                    val name = listElement.findViewById<TextView>(R.id.title)
                    val content = listElement.findViewById<TextView>(R.id.content)
                    val date = listElement.findViewById<TextView>(R.id.date)

                    name.text = stringsList[i].title
                    if(stringsList[i].content.length > 15){
                        content.text = stringsList[i].content.substring(0,15) + "……"
                    }else{
                        content.text = stringsList[i].content
                    }
                    date.text = SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH).parse(stringsList[i].start_date)?.let { SimpleDateFormat("yyyy/MM/dd", Locale.ENGLISH).format(it) }


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
                                val act = activity as FragmentSwitchListener
                                act.replaceFragmentWithArgs(R.id.nav_announcement,stringsList[i].announcement_id.toString())
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

        return binding.root
    }

}