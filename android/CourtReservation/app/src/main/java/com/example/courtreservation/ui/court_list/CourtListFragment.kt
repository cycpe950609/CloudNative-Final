package com.example.courtreservation.ui.court_list

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentCourtListBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.FragmentSwitchListener
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson

data class CourtInfo(
    val court_id: Int,
    val court_name: String,
    val current_reservation_count: Int,
    val is_open: Boolean,
    val max_capacity: Int,
    val reserved_date: String?, // 这里使用 String? 因为值可能为 null
    val reserved_time: String?,  // 同上，使用 String? 表示可空类型
    val stadium_id: Int
)
class CourtListFragment: Fragment() {
    private var _binding: FragmentCourtListBinding? = null
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/courtinfo/"

    private val binding get() = _binding!!
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        var stadium_name = arguments?.getString("args")
        requireActivity().title = stadium_name
        (requireActivity() as? AppCompatActivity)?.supportActionBar?.title = stadium_name
    }

    @SuppressLint("ClickableViewAccessibility", "ResourceAsColor")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCourtListBinding.inflate(inflater,container,false)
        var root = binding.root

        var stadium_name = arguments?.getString("args")
        println(stadium_name)
        var act = activity as FragmentSwitchListener
        requireActivity().title = stadium_name
        (requireActivity() as? AppCompatActivity)?.supportActionBar?.title = stadium_name

        val linearLayoutContainer: LinearLayout = root.findViewById(R.id.court_list)

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                val listType = object : TypeToken<List<CourtInfo>>() {}.type

                val stringsList: List<CourtInfo> = Gson().fromJson(jsonResult, listType)

                for(i in stringsList.indices){
                    val listElement = inflater.inflate(R.layout.court_list_element, linearLayoutContainer, false)

                    var ele_title = listElement.findViewById<TextView>(R.id.custom_view_text)
                    var ele_status = listElement.findViewById<TextView>(R.id.status)
                    ele_title.text = stringsList[i].court_name
                    ele_status.text = "● "
                    if(!stringsList[i].is_open){
                        ele_status.text = ele_status.text as String + "暫時未開放"
                        ele_status.setTextColor(ContextCompat.getColor(requireContext(), R.color.unavailable_gray))
                    }else if(stringsList[i].current_reservation_count != 0){
                        if (stringsList[i].max_capacity == stringsList[i].current_reservation_count){
                            ele_status.text = ele_status.text as String + "人數已滿"
                            ele_status.setTextColor(ContextCompat.getColor(requireContext(),R.color.busy_red))
                        }else{
                            ele_status.text = ele_status.text as String + "使用中，可加入 " + (stringsList[i].max_capacity - stringsList[i].current_reservation_count).toString()
                            ele_status.setTextColor(ContextCompat.getColor(requireContext(),R.color.available_orange))
                        }

                    }else{
                        ele_status.text = ele_status.text as String + "無人使用"
                        ele_status.setTextColor(ContextCompat.getColor(requireContext(), R.color.free_green))
                    }

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
                                val arg = (stringsList[i].stadium_id).toString() + "," + stringsList[i].court_name + "," + (stringsList[i].court_id).toString()

                                act.replaceFragmentWithArgs(R.id.nav_court_info,arg)
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

        fetchMenuTask.execute(url + stadium_name)

        return root
    }
}