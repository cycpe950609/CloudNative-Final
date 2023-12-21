package com.example.courtreservation.ui.reservation_record

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentCourtBinding
import com.example.courtreservation.databinding.FragmentReservationRecordBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.ui.announcement_list.announcement
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson


data class reservation_info(
    val booker: String,
    val stadium_name: String,
    val court_name: String,
    val reserved_date: String,
    val reserved_time: Int,
    val booking_time: String,
    val all_join_users: List<String>
)
class ReservationRecordFragment:Fragment() {
    private var _binding: FragmentReservationRecordBinding? = null
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/reservation_id/"

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReservationRecordBinding.inflate(inflater, container, false)
        val root: View = binding.root

        var reservation_id : Int? = arguments?.getString("args")?.toInt()

        FetchDataTask{jsonResult ->
            val listType = object : TypeToken<reservation_info>() {}.type

            val stringsList: reservation_info = Gson().fromJson(jsonResult, listType)

            binding.location.text = binding.location.text.toString() + stringsList.stadium_name + " " + stringsList.court_name
            binding.time.text = stringsList.reserved_date + " " + stringsList.reserved_time + ":00 ~ " + stringsList.reserved_time + ":00"
            binding.booker.text = stringsList.booker
            binding.bookingTime.text = stringsList.booking_time
            binding.joiners.text = stringsList.all_join_users.toString()

        }.execute(url + reservation_id.toString())
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}