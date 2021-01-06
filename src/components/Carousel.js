import React from "react"
import { withRouter } from "react-router-dom"
import { Carousel } from "react-responsive-carousel"
import { connect } from "react-redux"
import { getEpisode } from "../api/spotifyApi"
import { changeQueue } from "../firebase/firebase"
import Typography from "@material-ui/core/Typography"

const MyCarousel = (props) => {
  const onCarouselClick = async (podcast) => {
    getEpisode(podcast.id, props.token).then((res) =>
      changeQueue(
        props.match.params.roomId,
        res,
        podcast.id,
        props.userData.display_name,
        0
      )
    )
  }
  let carousels = [
    { 
      id: 1,
      title: "Popular Podcasts",
      data: props.podcasts,
    },
    {
      id: 2,
      title: "Podcast Essentials",
      data: props.playlist,
    },
    {
      id: 3,
      title: "Your Daily Picks",
      data: props.dailyPodcasts,
    },
  ]
  console.log(carousels)
  const isReady = () => {
    let ready = true
    //Check if all of the podcasts loaded
    carousels.forEach(c => {
      if (!Object.keys(c.data).length) {
        ready = false
      }
    })
    return ready
  }

  return (
    <div className="all-carousels">
      {carousels.map((carousel) => (
        <div key={carousel.id} className="single-carousel">
          <Typography
            color="textSecondary"
            className="playlist-name"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {carousel.title}
          </Typography>

          <Carousel autoPlay showThumbs={false} infiniteLoop={true}>
            {carousel.data && carousel.data.map((podcast) => {
              return podcast && 
              <div key={podcast.id} onClick={() => onCarouselClick(podcast)}>
                <img alt="" src={podcast.image} />
                <p className="legend">{podcast.name}</p>
              </div>
            })}
          </Carousel>
        </div>
      ))}
    </div>
  )
}

const mapToProps = (state) => ({
  token: state.access_token,
  userData: state.userData,
})

export default withRouter(connect(mapToProps)(MyCarousel))
