package com.example.courtreservation.ui.announcement

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.courtreservation.MainActivity
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentAnnouncementBinding
import com.example.courtreservation.FragmentSwitchListener
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.ui.announcement_list.announcement
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson


class AnnouncementFragment: Fragment() {
    private var _binding: FragmentAnnouncementBinding? = null
    private val binding get() = _binding!!
    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/announcement/"

    @SuppressLint("RestrictedApi")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        super.onCreate(savedInstanceState)

        _binding = FragmentAnnouncementBinding.inflate(layoutInflater)
        val root = binding.root

        var announcement_id : Int? = arguments?.getString("args")?.toInt()

        FetchDataTask{jsonResult ->
            val listType = object : TypeToken<List<announcement>>() {}.type

            val stringsList: List<announcement> = Gson().fromJson(jsonResult, listType)

            requireActivity().title = stringsList[0].title
            (requireActivity() as? AppCompatActivity)?.supportActionBar?.title = stringsList[0].title

            binding.bulletText.text = stringsList[0].content

        }.execute(url + announcement_id.toString())



        val backbtn = binding.btnBack
        backbtn.setOnClickListener{
            onBackPressed()
        }

        return root

    }
    private fun onBackPressed() {
        var main_activity = activity as FragmentSwitchListener
        main_activity.goBack()
    }
}


