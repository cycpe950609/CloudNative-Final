package com.example.courtreservation

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.Menu
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.example.courtreservation.databinding.ActivityMainBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.ui.court_reservation.CourtReservationFragment
import com.example.courtreservation.ui.home.FragmentSwitchListener
import com.example.courtreservation.ui.login.LoginActivity
import com.google.android.material.imageview.ShapeableImageView
import com.google.android.material.navigation.NavigationView
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson

class MainActivity : AppCompatActivity(), FragmentSwitchListener {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private val CHANNEL_ID = "my_channel"
    private val NOTIFICATION_PERMISSION_CODE = 123

    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/stadium_name"


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarMain.toolbar)
        //findViewById(R.id.nav_bar)

        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home
            ), drawerLayout
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)

        var btn1 = findViewById<Button>(R.id.btn_1)
        btn1.setOnClickListener {
            replaceFragment(CourtReservationFragment())
        }
        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                var submenu = navView.menu.findItem(R.id.court_menu_item).subMenu

                val listType = object : TypeToken<List<String>>() {}.type

                val stringsList: List<String> = Gson().fromJson(jsonResult, listType)
                println(stringsList)

                for(i in stringsList.indices){
                    submenu?.add(0,R.id.nav_court,i,stringsList[i])
                }
            } else {
                null
            }
        }

        fetchMenuTask.execute(url)

        val headerView = navView.getHeaderView(0)

        var profile_picture = headerView.findViewById<ShapeableImageView>(R.id.imageView)

        profile_picture?.setOnClickListener{
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        var isLogin = LoginActivity.Usersingleton.userid != -1

        if (isLogin) {
            var menu = navView.menu
            var item = menu.add(R.id.nav_matching, Menu.NONE, R.id.nav_matching_record, R.string.menu_matching_record)
            var item2 = menu.add(R.id.nav_reservation, Menu.NONE, R.id.nav_reservation_record, R.string.menu_court_reservation)
            //var item3 = menu.add(Menu.NONE, Menu.NONE, R.id.nav_user_info, R.string.menu_matching_record)


        }
    }

    /*override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        MenuCompat.setGroupDividerEnabled(menu, false);
        return false
    }*/

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val notificationPermission = checkSelfPermission("android.permission.VIBRATE")
            if (notificationPermission != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf("android.permission.VIBRATE"), NOTIFICATION_PERMISSION_CODE)
            } else {
                val builder = NotificationCompat.Builder(this, CHANNEL_ID)
                    .setSmallIcon(R.drawable.user_selfie)
                    .setContentTitle("My Notification Title")
                    .setContentText("Hello, this is a notification.")
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)

                with(NotificationManagerCompat.from(this)) {
                    notify(1, builder.build())
                }
            }
        } else {
            val builder = NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.user_selfie)
                .setContentTitle("My Notification Title")
                .setContentText("Hello, this is a notification.")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)

            with(NotificationManagerCompat.from(this)) {
                notify(1, builder.build())
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "My Channel"
            val descriptionText = "My Channel Description"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }

            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    override fun replaceFragment(newFragment: Fragment) {
        val fragmentManager = supportFragmentManager
        val fragmentTransaction = fragmentManager.beginTransaction()


        fragmentTransaction.replace(R.id.drawer_layout, newFragment)
        fragmentTransaction.addToBackStack(null) // 可選，如果你想支持後退按鈕

        fragmentTransaction.commit()
    }
}