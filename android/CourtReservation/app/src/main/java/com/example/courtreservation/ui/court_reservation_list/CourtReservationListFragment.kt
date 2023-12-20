package com.example.courtreservation.ui.court_reservation_list

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentCourtListBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.FragmentSwitchListener
import com.example.courtreservation.databinding.FragmentCourtReservationListBinding
import com.example.courtreservation.ui.login.LoginActivity
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson

data class reserv_element(
    val reservation_id: Int,
    val reserved_time: String,
    val court_name: String,
    val stadium_name: String
)
class CourtReservationListFragment: Fragment() {
    private var _binding: FragmentCourtReservationListBinding? = null
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/reservation/"

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
        _binding = FragmentCourtReservationListBinding.inflate(inflater,container,false)
        var root = binding.root

        var act = activity as FragmentSwitchListener
        val username = LoginActivity.Usersingleton.username


        val linearLayoutContainer: LinearLayout = root.findViewById(R.id.court_reservation_list)

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                val listType = object : TypeToken<List<reserv_element>>() {}.type

                val stringsList: List<reserv_element> = Gson().fromJson(jsonResult, listType)

                for(i in stringsList.indices){
                    val listElement = inflater.inflate(R.layout.court_reservation_list_element, linearLayoutContainer, false)

                    var ele_location = listElement.findViewById<TextView>(R.id.location_name)
                    var ele_date = listElement.findViewById<TextView>(R.id.date)
                    ele_location.text = ele_location.text.toString() + stringsList[i].stadium_name + " " + stringsList[i].court_name
                    ele_date.text = ele_date.text.toString() + stringsList[i].reserved_time


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
                                val arg = stringsList[i].reservation_id.toString()

                                act.replaceFragmentWithArgs(R.id.nav_reservation_record,arg)
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
}