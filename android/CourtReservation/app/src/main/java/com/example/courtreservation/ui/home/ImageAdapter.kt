package com.example.courtreservation.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.example.courtreservation.R
import com.example.courtreservation.FragmentSwitchListener

class ImageAdapter(private val imageList: List<Int>, private val listener: FragmentSwitchListener, private val viewPager:ViewPager2) : RecyclerView.Adapter<ImageViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ImageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.fragment_image, parent, false)

        return ImageViewHolder(view)
    }

    override fun onBindViewHolder(holder: ImageViewHolder, position: Int) {
        val imageResource = imageList[position]
        holder.imageView.setImageResource(imageResource)

        holder.imageView.setOnClickListener{
            if (viewPager.isUserInputEnabled){
                listener.replaceFragmentWithArgs(R.id.nav_announcement,position.toString())
            }
        }

    }

    override fun getItemCount(): Int {
        return imageList.size
    }

    fun enableInput() {
        viewPager.isUserInputEnabled = true
    }

    fun disableInput() {
        viewPager.isUserInputEnabled = false
    }



}

class ImageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val imageView: ImageView = itemView.findViewById(R.id.imageView)

}