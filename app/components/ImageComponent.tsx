"use client";
import type { Nasa } from "@/types";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  image: Nasa;
};

const ImageComponent = ({ image }: Props) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [users, setUsers] = useState<{ name: string; image: string }[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const { data: session } = useSession();

  const handleMouseEnter = async () => {
    try {
      const res = await fetch(`/api/likes/${image.date}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setShowUsers(true);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleMouseLeave = () => {
    setShowUsers(false);
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/${image.date}`);

        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes);
          setLiked(data.liked);
          setUsers(data.users || []);
          //console.log(data.users);
        } else {
          throw new Error("Failed to fetch likes");
        }
      } catch (error) {
        console.error("Failed to fetch likes", error);
      }
    };

    fetchLikes();
  }, [image.date]);

  const handleLikeClick = async () => {
    if (!session) {
      return;
    }

    try {
      const res = await fetch(`/api/likes/${image.date}`, {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // No need to send userId here
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes); // Update likes count based on API response
        setLiked(!liked); // Toggle liked state
        setUsers(data.users || []);
      } else {
        throw new Error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div key={image.date} className="relative w-full h-64">
      <Link href={`/nasa/apod/${encodeURIComponent(image.date)}`}>
        <Image
          src={image.url}
          alt="apod"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRoQqAABXRUJQVlA4IHgqAACw5QGdASpABqQDPm02mEmsLC0kIPVoaaANiWlu8YA+BRPB0RPkPc9vd6tfpbG9m478nP/fgoWE/98vVwK4+O9RjV/5gND+4v+f46sA0aDftoMeZeL2QbPLxeyDZ5eL2QbPLxeyDZ5eL2QbPgLrCSGHqqawZpRkGPMvs4s8ver2QjL6rnJgFqrEGzy8Xwq3Yy+D1g0cHv3MIx5e6iQbPLxhtasWexios38ZX/M5OqawZpT5gTys9s9jD66tl4vZBtGPMmZBtGSORezZ2z4C9YeqprJWyE+uwu1OsIF3ACNms8QKDIMj1VlulGTHtnmeVbj0VhPF1bRyL2SLi1a8Xsj0y6wZsZeyKxoloiNDwm+K97AZvxZ5e9Xsjv+ZZn9Z4ggppUy9XzM5OqawZsZhsfi0uqdXzLyAziOgzSjIYM5OzcRZs7Z7GHtTWEkMPVVzZ4goO62Yx5fb4r3q9pVzIV+Xi9kGzy8Yci6OIx5e1Nj2TRxGPL6uGPOS+INnsYe1rHFeMM5R/dVZ3mHkHSjIMiBdqayVsgx5l4vZCMvqnt6ljag6UZBjzL3q9kGz4C/vp8eisWK+OjImSoEoCNIMM/qmsILRU+bdWvF7INnl5K1Musr/sYe1NYM0oyY9s8vF7INnl71e8r0AojQXbHdgGiVwm80Ht+fjzLxeyDZ5eL4PWTIl1a5e1NYNG9BkGPOAusGaUZBo4eo1KbF6QikZtCm8cyVPYFiJ1XKGzy+UnxXwesGaYrwesGaUZBjzLxeyDZ5vUPamsGaUZBkFfaucGPMsEJgks6fqixJJr4eq/jYOjgANnl4vZBs8vF7INnl4vZBs8vF7INnl4vZBs9yRmRPmTHP3JQk1AnC64dOrJGbCgfZhIeXUQcZdBmlGwfkcT2prBmlGQY82MPamsGaUZBjzLxeyfiDURUURogIwHkPiUI1UZorTGb21i8t90V0oyDHmyxMecBdYM0oyGGMPamsGaUZBjzLxeyIJ0GAcx4XRzrHUu7bfjnFfMFw584PMY+oqLoDMeZeMNj8WeXvV7IN9VU1gzSoxm/Fnl4vZBtASBl7MWes/qnz1wyYntVl6EqPMN1/J8eFBGzwJmlGQZHqqfvWeXi9kGzy8Xsg2eXi9kIEzYy9hkmVT+Ms9xqY9EQPDLw6N5gLzvKG6spx6sm7ZYjBk64MRBs8ver2bwq8lEy+qawZpRkMF4vZBtGPL6uGPL+NrVZ5JmIL6Od8x8N7Do3qI/qloJqf/9FrmVU/QBcO0NFzILL2prGwRZBs8vF7INnl9nF1a5e1Or5l4vZBrcLpCrJqTWjKUZKP89peYu8el+Pd49Lzj/7oIr/VptTb///X8v11Y0Okl4vZCBM0phZBs8vF7INnmdtMgx5l4vZBs8uwWY9XmrCl48N7D5j4b2HzHJe8NRZfkud6+zkpHT8NsfjFY7+7FMwogUGQY8y8Xsg2exh7qJFfcFgs8vF7IN12NIK18HDRnpNd8x8N7D5j4Zn7Hvrez170wFo1z3hw+eRr2aYumV2scY8y8Xsg2eX3Fn1nl4w2PxZ5eL2QbPLrtg9JQZFXG+Lp6X493j0vx7vBiukA/gFsEwRo8E/3/dihGEPZabXA2bl6DSW3QPLuHtsQbdA66Qe1NYM0oyE/MvqmsGgOUi2gdxnS0vYfMfDew+Y/+7lI16el7Db55f7PbnSD//V0wPSpawLiyqA0OtxeyDZ5eL2QbPLxeyDZ5eL2RY4ntTV5en9weZ3sPmPhvWPtPmPhmEBw1UIAUcrbp0QpQfIdfpfjt+U++Lx80lsv2wFVqGvZbsvamsaECgyDHmXi9kGzy8XwesGowDZ5eLgrKD2dJfS/Hu8el+JfHNSW7hWCPtPlLr6aCcGb1TPkmZOVyvPmP/yZT8EBgE4UL6yP5pXiJiE0GiSb7OlRT2CqJ2AYgx7dgA2eXi9kGzzOTqmsGaUZBjzLxezZp5VO2i+nFh6X493D7B9g+wfadB6XGiru9toz6EarfsDMvnOt1IWA3EG/x7DPMRorexyb8rbetmYb8cTqBm/Fnl4vZBs8vF7IN1a5e1NYM0oyDHmxh5iLci6CUpj4b2Hyb4xl2BSOlFQ8soreLkS+yvRAn6N1cYihEuT3tb56ww7RYEw92mPtOjN3zEePHAfnqW1C1ecOW2Do3TFR9crB7bEMZZbdA66Qe1NYM0oyDXl1atkEni8oDEhub98xmH6D8+BPPsV1qmWQPtOjNT7BwXzhJmAecY2oa1mft8q7xrrvu4bSJ3PqYuzVc5y2g/+HZGKivnl4vZHfYw2PxZ5eL2QbPL3q9kGzy8Xs1zGlp2BJBAvCL2Hyb498emy7m6LjHOz7Tn+N4yq//6wFAPKG0zteHqNLU1X06/4SBoG3d07YqJlV0i9PrL8Pehq/8w/Z6G+ssogI+5G26B10HtsQcTV0HtsQb+IOlGQY8y8Xsg2fAXqVkqfhKFVEySL49qwbD7jq60yse1ZqrL0fX1Y6ucGG4sBk+qazOvz4FB+l+PA6iBPP3Qq1b1yIUSol3PHXx5bFKXkbBMpFP1xLMHtqkB6dD74w7RjNKMgx5l4vhVw3oMgx5l9nFnl4vZBs8vF7C+qUdYzmhRlGUO0xwN8qoD7bSardMBz69oAfPAnkXxBIP/VJlofmb7QUzAnwJ7+qJUmCiMNWAtkY8KBEC1nMcTKRlGUbueQ/+aQpmlGQZHqrMx5Bs9jD2prBmlGQY8y8Xsg2eX8pUT1fkpA8N7DUlycJAGXJLbow/8LusPcP9mrHq9TTJsJK3dJVGFH06KlRpLc6qr8RDI8bYIq/SQh4c4G0xwlIE083hk3W4e5RKLN+Lq1y9qawZpRkJ+m8RS2cWeXjDY/jBmxlw+UU0lESSfp6X4l8em8OkvbVag9wvhURFLfIT6fE7bUFG8NoDmaa1mtYk9YymSA6TF/mZ0VZEVpLwGsNFN2mLk+0+YzLdb7GNxtmZssWA6IFBkGPMzzDQUGwfFnl4vg9YM0oyDHmXjDaNkNOeccfbjLCEh7ChBomek1xa0MFNM7R1NNblcYP81lWBvP6DR8IlcMLIFAQqU2x7bjwjYc/+BxlK7uH0v8Q7ZaObhczW4Lk0LogUGQY8zOUEUQKDIMk/QKDIMeZeShZ5eMNgE034LE25d4V5bPqBxqyc8mSFRkgNuhIb6k++0FsxAyUWX+B/Axiq+UuLJ0WFIbTkq9VKjRKiXT0D2l/CTWXL9uU6gyDHmXjDY/Fnl4vZBs8vF8Hsvp7GHtTWDI5+w1ltAzm6hPBzZ4E86Hx4AvDJksEab5EQAjm/jv/+Bt9pu/qlRpUaJUSpUe+S4UlZzz2O9h/R/dKVjlzwx5l4vg9faIFBkGPezyw6UZBjzM5OqawZpQMOzKjfuaTFzA5AX6C7wrzED60c+tflkQ7pq2rfoMpyo0qNKjRKlRpUenKVj6CBMT0csKUyav6Dp9qDXrFL3JI+4yjBjt6OMUQKDIMeseXtTWDNKNg+LPLxe0OrHGPMvF7NoWIYGhOwOQfbFeYgQ9A4FdfsTuzRPrADPsHdMqXN1DNN39d8e+Vd2wX/utbgBQmieXQOug9tiDiaug9tiFcrIPamsGaUZBkO6dQZBjZvrPa9VY0+SyhB36K8uvoLeLj/A+Qd09ZfHvj3yJ0B0xjuz0sZ7+YZ8GszKaOMpg66D22INugdhNkDroPb320Y8vaubPECgyE+s8BALQFZfE5u4Qog79FeYgdVwTPFvuim2z193j0vx7vCTi20AN+6B/rj3mcVlXfBlXhjzLxezZ2zy8Xsg2eXi9kG+qqawZpRkGNsSmA4fDCNKfYAjM6PoHV/j3eCZjoDG/S849L8e7x/e4f6mWaVK842G9Oi9kGz2MPamsGaUZBjzLxhsfizy8Xsg2eAizwKByEPnqiibO/xrVhM4fERYZoyJPDf8+p2drYu/LJ7n9G7Oy9qaxoQKDINeXVNYTPrxeyDZ5eL2QbPLxeyD0z1n+y3dSbP/+95d334789VJXi2yu/YCs2ucPLxeyDZ5eL2bO2jHmTMg2eXi9kGzy8Xsg2d90gXgv9GLROqOzhDitvyHcrEkkuAEKqg2YqW10HtsQbdA66D22INugnogUGQY8y8gM34s8vF/Z6qF9DBA6HwIeeH/1WEcm+8zLs4yqbhlkU/AzBXptiosOug9ts/QOug9tiEoFBkGPMvF7INoyOE5aId9t+31dIpGwh70FR/BVGQ2yH7QPuQ0hcD7XQe2xBt0DroPbYg26B3+qawZpTCyDZ5e9gM3+l3da/Gwnj/tBbSxwtzl49jFsIrsq3uuF99NsQbdA66D6nbdA66D22ISgUGQY8y8Xsg2eXvV7IOrGfvjZSRbvEaVX+EmVUUxoPtMZcRJ4uD22INugddB+A7oPwHdB7bRcZjzLxeyDZ5eL2QbPLxejFy7y4gdTPbfFE7eqd+CKy6710ddB7bEG3QOug9tiDboHXSD2prBmlGQY8y8Xsg2eXjT+gvPm47QOjTftzvOkZVaObWEV26B10HtsQbdA66D6nbdA66Ehs8vF7NnbPLxeyDZ5sTxZ6TD0jvIeWwT0opLb+3dh3eg9tiDboHXQe2xBt0qwe2xhNvYgnsWeXvV7IN1a5e1Or5l4v9k49zYwkstr1610HttEy6J+RA7e+2eXi9oYXkBm/Fnl4w2PxZ5eL2QbPLxeyDZ5nJ1U2ITye+9ffvx7boHXQe2xBt0DroPbYg26VYPbYg26B10g9qawZpRkGPMvF7INnl4vZBtAw8pR1uEZ66iB22INugddB7bEG3Tme26DSW3QOug+rdHopwtl4vZBs8vewOymsGaUZBjzLxtM0dDQZuGG6NlJ4w7Ug26NqfvWeXvV7INnmxPz7F7IN9VU1gzTFeD1g1JH5eL2QbPM5OqaiHXQfI7tswEG3QO/1XVRDtdSGQY8y8XshG0H2iJdU1gzSjIT6zy8XtDC8Xsg2eXi326B17bM6HG2pBt7EEEvZBurXL66tl4vZBs8vIDN+LPLxezZ2zy8Xsg2eXi9kGzNkDrpBk8frt0DrpGQyDHmXkoWeXi9kGzy8Xsg2eXi9kGzzeoe1NYM0oyDIgXamoh10HyO7bMBBt0Dv9U1hAwgl7INnl5KFnl5K1MusGaUZBjzYw9qawZpRkGQ7XUhw267akJRoiAQvt0Dr282MPamsr/l4vlfsYYAAA/v/4C/g72mpYGm+e0r2+CHk1Uay4pJjghrifDsn5IXo7ZN09MBb8jGf7s1rp6ClrbnJ8IdNx48W995Vq148ibucYCvvDZ52WcGdYGrosI9LYUbG3cvfpOHQJsg0FloANRkogYBxOUrOrROTCqIEx/EfmXBut4RPKreWDA7s8AE9dfK/EZ/lbAiTEifsgvfDEGQDjN4Dr8rFPamzEC6ssFhpJdOE1DFmrD/DGY8LawTwvqgLO949aUfv/p41AjSS9OLRaZnggPHvQb/J5/YagbYNVQ3KD4K1nkIu40bcAAem2wEeYbD6Hwg7s0RW9Lg46TQyBzC7qu2aAQEFGNZo9nFLo5tZBIpR+4/TZ6XxySEcO2W0ha6OwUA7r22QE2CRAnbF2XG6Q+x2f4k3BkFQ7NAEJBwT4asykEgzsQitUA2wZiBl0UFx+0N00i2hIfYzdILMjcFxklQrH+VCd6t4FowZRLg29wATtHiqKhOaEpnnKZ5c3APneiCnZAwgbbZiFQ1IMQesAinArn55gAzwEWAPLIPKgphAyn1hGXA7sx8TR9MWysUt9kqkoDf70NE9GWbm6syAqAWmsXaHY3RzET5IafPLM53kEbgQrdvKsI8iHA82Gnc4c2APfZXGyP4Y4bNGNcK+lbNJa3oSzM9hd7sua+Peeyb/mXigcQ+vFpQc8M4FuO9IFE057oC/Axf3u8RRcCagEVqKIW1khhI2TcbKGRbRO047688bV0MND8TnhFN8y7k6nIH9IQ9K85KvGrEyOn3hF7h72wqTtHA8yLkiEtS606fB2/VYAKRWZFioAxDpbcmWgpkjUBNHRIaxGf9RCZHMR/mgBZM0TCDqUHeYBZoanyLXG0R1EfHlygt+qZQ7Jee8jswRnEDzi/d1mlhWccqgIYB5DdSJCABuP5lUmBIka8VxmDMKohAz/JtV168P/QMyNS/G543/N1XTWmB4tgl8aifV0UYioQxt9Az8l8DTCYyPi12kYhGI/lzlq9o+AMTlnnek6M7d5c4FC/GxJE1ckHTI8TS6H4ifgxAtQ6vtKetKKFlcaNpd3ywZvYGWsHp6PrPFwxGj50IgNt9DhuEyDFVJKJ4AoTqQlTeek8528ce2UJ1wemFDyt/uP6EnUJagkHIjC62yYM2qWg3IAd8wWeHJ2MGciryCaQPR+oSKXcubz5CZmBZs9YazLzHYagCARoal+4B2sdXlhpwmCBC605zTWHqWi4A1x9D7RJqHMyiyiFfG/w2z1BAhVerqmf27dHhG6snLnoXeO7kvWlGJKK1reMrbVKK3JIbxF9yMyDgTkg3wAzavCxxjyNd+0veuwcdHz+7n6RzXCcivwNv2gh4Fb5x2PAfAIiGCXWdu6d5DZboyT1KMxveYHkO0TU48lx04GGtK63n1CxAcyOgjRVXLkT2RLm1lhq8AcQUXNA1ZnVMKVcs82UTDv+oNYGZ6OgUiCb/hDw5CYagGcdPPn8ua8DnAzzzuyDbtNB/LjVSI+hOcaSSUzhRggwLX38WGJ+UksbaIF2ZY+ZPNwTU1DsbGFahacix+Z2PnK0Sgl6Dc9uoLMyQtayVEeZxguA4yfmvj9/+wER/sRYtIp0kAfnHQsdT2N9+yhVaccb3n2vRIfAoNWNTOji/kbIH57o+1Ao91+KDv0wIxRWbBJ3oWFYTQytthrjjS3RX45DIYoKB/8poIXEqA72fvXYJsxcbqiL+SgbGgB8cufUlLsh9N3YnwSG4c8CJgmrALiAM0Jm+mhYacf4bektg0s1bvVAxg/r6luQeZL8uMDRgiegpE6jxoVWDkLAylJhEH53l5FowHcxF/NxByeHwxudl0r22FpFsTTs0TAx0JrJ3rxoYCQLU7gAHhIH5ZDNXbqXnanUTykA0it0rQT0BmojTbMlgPcW6JNSM13wTKFqJOUaJTdspruG42xSoDVRDZctRbXi5BorORCwAFUiELy64BZlibQi91UredvesTFzpKJ/ipD43wr76iesOniSNvZdK+RISYTrxKlSL2MxbnPkd01poVdWRx+wPvIGQfxi05Rbs0mEII2dUMy+D+a4EzF1M8jbdk4kNYQZ0mPAjfR6BS6+CiMNVvGGntbCwytqSsAekYpWCsqXV0fMffrz2MRW6HfMNc+EINOHRrhe2cNWmJ11E2UPMWK/6dvypjRk1YEsEaaZuiT8H6LK4LivffyZgMGWASexzE9eWA6x4oWYZxQH6ObwEDyxUjsz9Een2GsSZ8sv/Sz5KRbIX/1Z3cunJnip7Q3kx8PRZw+v/PMbXdcJv6mFcEU9sfU6JuNNKZn62aeIPx9sB1VbfeApNzQQM7QV5AmAeR8vJPykccITPtsCQI6Jw83vqdKbNlBDAAAO/08MsfvGn6LHP8433etWx2oP9J0XHIJBWQRjSYqaCK/5enYYGl1Qvp8aS6zIQ+7X5UR0fRoikSTn76XVpsmgFp9s62Zas//X6NJdx0vUXJYym0RKxxfIFu4pbvAUaWuJEjh/g5drQ9FwUjVs9s/6iSkMkcDE6/iYNFpw4qmtrf4kkzN/0npo554o8wTKLtRKj3hR7KLtytqs2APQs3lbU51wTK24zheXvRyEqiH9xfzzqVD41QaEIppwAqiz1Sj4KZmuKD/Rp0911gNhHf6KriLApIo0EPex3umJ7Cep6Tc8i6AUMCa0G5Kc4kdz2/yQzb/UbRHTorpX3BV87NF5h0+FlloR/h3xtZzN9BS347uLokh5DxlBLqTSHuE2T6YRoMmpoFEVxtJc90C+jPyaopvanXjCaCPaKvLWeCntg03SENlfpN8Cl0Z5CXfR6k33F3HQ+ImISIXIrtpl2XRLmx3ebYMC65zaBv1nPyG9oCQTxLePQmFRCjm5Su2MUppWhobvaoFNrxAyka3rRxJfaEkwTOTWDHxABqcKMuPf6hs/hH0wTQDX/wfrwSbnwr9rMLfs8tg6++BgbwjeGAWzKjrWfPY/MfEtO7uNnL9VcDnUN3ubWRgYiPYqaLtspygf2lWS6RT2rlIXoo7yE8jNbOl+3nrWPa0dyshLhBHEnn6PCTxmpYQDcik6EncbEIJGozjvQm5/x8mfmM+nkHuy0DHd4HjUK4xy1U9F3WWAcuM/gWZtBGxOj9YiO4j7SKkAmPn9F/aU83X2BCL5WcTgcpJD5lurZXOiU+aH5fd3NLzWdcnfUOSiqlxSSkBOQvPiGYxXQgZz/zx9gmkWY+YbBpNmsqQJllMXStSw0g1onXk3EphKlNu54ycVzUzy+KU30CseQWXKbhng9aVFnHnYYiksh25MQGDZzEvzRl245PfXJ2LJ0hI+TS2JP+w6+hIH95pIZCgjthi8zvEGkJKG3XKpsEg/ePE1GDSAsN/wszXX3of4RCiFlRBSo0t4lN6l6zG1yX34KlHn4KrI56bMy5kH5zy8lAyFOlljWSvzAs3KdLeAznczuB6kJBXvKvs9/9UalxdbGaKV6qRn75Wk4JSK8k2Z4YHmf2QZV9+TG+CkAyclfpfBEepVsAYilv1q1imdw6xdEl8fX+CXJ2sa6Wgl4/bItE9OT3e8xcytPQ7sejfVD5iG2y/vGDytAF0qPR8knx7E4nwG39FUgFRT0YNBGDwWlc00cgkCj989oJZqoAnmaAut1Bbf+lx/6/WpRp1mZNPwX3oUBiLss2/fXl1XPuBLN+g1zzdb0GVKh9bkmIP8K756xcGHt9d68l/nHMTGR/c+garFsujbcHHhmI0oyWsRJoiNyDEJBTdhGEd/QtQX+9zcwbpA3v8Sgevb0cTD2f5aSEAMFHgiXPzqkGITRymWcvVTEf6/ugSc6gXyAMLw0F0OcIUGgD4JR+KBFbxL4zxMAboBgoMlo4VAiL4EBoLgArceMYxAvzPj1zsHBz0DTScbVyBOo733vFnPHsyjMnBkxPRj4cy5lG+GTCpm5U3q2BgVOzZgGF9RFyCvp6yjeecsR3hFyre/ZPs412SVi6tBNNcpJwBqKqm4G4zRid2HRzEPc4DiE390KJM0h1i5ODhUIlA+JvIp331y+24I/4ttWdMt8ZnZtWTrFbVjjJAudJDVmzeSetm4CQZ75qpTJ1VQbK3Q/35L/h1Bs48HXbuXluVcj5sE3oPgKjeLv7Z8+r8Mt12I1kvP8wABSSihwMWbvBpSJliU44xZgR6/DU01mxtU3bnAHBrNGvhLaj0tjgBw4tMrhyRi+T5Ah00/exuXA5jc7Ft5X0uQgFust79z52kACYJpvHAS0jkZUbKLFUduEGLslca/nOnC9YgtmLsQeF1sZXiCYbUAJ+/yDPKF1uLPMFPldkEdsB5IlWcKhtz3Oa8akpI2FOC66UtoPT1VRRnhU5f2UkqpykmCkYjzaK+x/JbETZiyCylh/obJxd0Ujl0r4u2JdIhp/kNSJrKb3p4Ydd/xK8geIy/CeDjWKtEk5+VFvxYmvaCaYTXl5B/5ElfTs8pvSXVZ/6iJYHVSWRQjTFkhdDNXYctvuRsAry/25WVfLqUmVtJrZvCP93TV9blKrJVC2zZkDTnKemyIsu9c6ZDH8aWDszcr2UP2i/cQaeNf6KAWGxhH2EPBVn1KnNqeBNlNqz64lzr8JTbnF0nNssU6pSLUfInM9JwaWiAte8xmYp3o+izneViQd4pEGnpWNtA7Ob3eW2426M8/gvhDXtFlqO9GAYQDruV+5VMZjJ+F+PEJtU1/1hO7l15LCbkYy8eM+yH9ZaNVCwUqPhe20YcrlJVdsH6uqtX8+etnfhL2AsaFKgssm6n0qpfAMmmJoLMkP2Mkakwk23VN37lVEmj01sE+WuTfS7VC6ePyv3MMtHTywOA2+JPzyhrR69buttByIIFtIcyQF+xeOKnZdMrsPd3FMld2tDhiF3CRZ+PEQogacobVIv+9r/dk+jEqm4sX7pLbgk/KdDF5EEaSxTKPscnjsvliDAqEkk09sj2wIpIuyn6ilUw+QM3XI/Ltb2J7+z30qexetKfy7BSe1bp0WTP4sbs4IxExpFJh7qwOki9/TbktZ1pB8jBvp1oHJtu/2BH1tKeZGC+Fnzp15zY5P+NpCY7jlde1RZZCN9kcUcoHoW6KvRh8MrsWn4vdOLCtn1ahgA+QIrmoH5dg5UlCQ4JkQgdMzPGis7XKQ98nvBoXF6An11BOIG+677JI4xKUf4Lnv11U1lFWPOrjdiFgR+jjNxKz70i3Ljnest7zHnHFMDXA/MDabR5RO3w8zKKcgkFylC9nmW8thxph5rnaJrfsUZGS9ELEhf4Ka/fnRDz29nioi6T6PeGE4ZlNMCZu3Smb5QC0lyqTbcuABy7J4gl2Muo8qlj6UnaWcI4fxpLzfqp87+3X0A7MgZLXqKvekw9E/pMhdN2VFcRW47oGz0v5WSdLTbUmLcJfcFYE0+7Wvel0s/RYtMQWjUW3LxUrbawH8ExHnGuc3gv17VrmP0InYcmoFSdOBXmCQBJZ9cofGvtyJoLFwhQx1WewLlSJj8GCtJ/PLEQpht3/nPYp4ViRm9+20547S8XCyCDOn6RJOdNU9YMWqO3DT5zonBqMMLdDhPK04UkWvceC/D5cpNUwlrhBc6Sfkt0peIeh6wOy7j7j/OyQYQliYymSOekHXkYS2k29nASIuOR/un+yUw3oRatbXRMT+dWvKh+c1QuNuIwrlctTQGdoGlfJt8WZx9Qo0zSjjvXiNVAJbHYxCXMVgKuwn0eKFJ2kPAYQ5TFxWTvEdct7NuAGOJHcxAwj8GEjsjzGAgyNtkfMY7PhO+c5T1OGIx8nJTkHqiGex3Ql4SRoMPU+Y1dsfe5PZ7IsG47MnLHyQTaXU8wUezPGmLlrga2Eq6SdKaJgD4IG4f7L2oW+0X4PYks/2BdwwGv3kD/m3h4qLlIBgPsc7Xa6EBE/U3ms6hrGfMRR5/7KhUoQnniDtKHeyy9l3vnyAGfZs5PfhZ/uXafRwxXXd4O+dxQJBdjfQzevQDv1iBZactoq1u8QMV2MzbtCWfmqBL20pW4bjFU7/eIdpy7S44DiBVjBWb+k0rp4aEupXfRfmWYAAR4Flkd2AodlQ6edDk4mSUOrdwsfkm4dtUZSd9uVfb8hCnFRC25BV8h2j5VGSZfMkDY8Po6LzpyIkph2V4NFbkCw0iwk7irr/dmIzjQlZdWEPwB4lB5x+58BSF6PxUDcAGx2U8QloAjskczKqsx/HndUX4R6I0PJFEPICGkH2J2xUhOalybEFAXq3DAwMiR/8N7asO+7w084n8rl70sinv53jcaD2ujvIGQJjOCeqjCpBMOMUG49+w8PHwGTMn1wurk+BlwrGa9hyuGBstuyER4Ig/CwWIkrDRFeWGC4Ldp2KOk5Of6Y60gGeR14wnit+6S0KY6jxstmZR/nSjO/iiOVTolbfmIFf6bzMS30U20uaHFuTxSkxInDqn7XJFpsR37GpQ3oj77QidLcy4UNauaxJ5P2WVV5dtcjae3G+SwM+LDUpwEzRyBtRKpEZMnI+VUE1yweLieQ0xlvpQn5iFW51rrmvI1/g7q4DL04tU/QkmiG/yW5Od8FWBMHkonpv2rJFsQCOxeU7wxiPzUgpvIfdszzlAA3pojKOvOXeB4+vtBhTTR0mr5hCcBm+BtJL/3A+Zn6yEx9O/tlMHRwebHsNoeM9ARzPmSytXjSV7z7Sutm1I8fYl2UEaNUf2cYfNxdAvooK+InkZ5nT1FfAXfYjr8lYDMwhzXcljesMaGajkOtjMLTxm9zhBP9cn9+ryhlGAg9XoSg2B9fejKaw8xsT0Dd4HMyIkAMAvmArRIXeAdr8dfIVsUJ3IFyV+CeaZLz2g9gXFlhNpAQzn5PRE3Y0BBKII2yJP/R3fa6P6m6FK1Zce/NlDYTGbZ9afWC9O4+P/gUBc18aDSzMc+VJhdFK/AWwT9IhnA1wQf5otKAg2Y1DTscYzooUxyMOj9M+YqKYr5HHKHFN8mwFiAT2mQONQzzQ1C4mb9jCKOBYPaf3kOBUnXAihp0wC+4xA5tvQwlu0N8qfG5qzgl9tr5q1F+yQTlxclNi+BHEdz730M2MbHQQc7+1M3WRVOjpHwkHF0W7nHUQX02IqffrT4ARc5lGquuKvqkTg2ALAQw0SXENuInflstWtCbh+tNFELbejsAIA85bC5dJr+/WM/sdv4YGIzIcjGKjtA1K2L6FYwA9uq/0eDspkPT3eIZkEZP12V2XxiMbSJaQJJE7HbACVl56KgcxKDyJQSxf7KR2f8IW7Zz6UYRjoOhHJyw2xVr2K+snTxjurPrueYhcWb3CIAVfvWBr2DEerqghiIqtF+nwDYe0C13vfUYI30DRq5TBCW8MDfwQGkY6xrUE4USyQAiVQFSBwZrer6uwKsXiNDUGqfd36DZEhOJgBZJ4yNYvmiK8Q5YjyOb7Ft1zeNIrH6K7nLDUUSAZIL97BiYNs656w5g/dz+IVKYwAeGS9uv1n6wixtMQ6gWe8gj3LX76gDjy3gLbPtt7c+GXWWQ74SOFP/QP+PFE/YQYlTDEZa6yzt1F8nDfO7+jPNT05y49G+qQnAtBIDLEphZ5Fsx/m24hPH518IYETuU2dtHqBaNyoGVG0m/+H9XHmKzg95f+zbi5i3NIPkJoDcn7kjnuiLb/VQS77+8LuOJWVLx5R0o/DNl+tP3r5/tCz/ACJRJ/TwhOoHBBWioIWF1A6nY/T5vDu3TTaMk4YRZGqo+gd6Zb7RSrHobV62SAsXq/8diKPodNyYyg3XNiFpCmB58WhlAVqcyG+KfE1JhyQw+Ok8svACSSes7jqO0Xq/lLrMnysnkkJsk+py1A0LwN9bkELUAph+vnEh7e4VK5n9C2ZkiMjn+ki11PSsLNOx+s6HIbWH05YzlUtn9fq3EHoRE1iup+GzOGZ4UHbZGZjbb8Fn5eOF9JV2NrPXt/ZBwDEhz3esn9B2kCEPLlMxX3bAqUQ2Eswy1v+rYTytBFMR+uB7K9/4AXf8/Vu8cq83uVgMPC3TcX0QQut10ypT4b8nJVWRr6GS3hisaLcANNIu/jMexHh+S+DHgzyQEVu8eVSZs4KUJxe+kL9/bAQnbsw/U5zTHmDmuLhCztCBeJsxlXViV7nVVyd58SnL2OueYRq4HFIHdiH2oBRYLd7ijvhAVsfzWQAXqZfTNGWESPdwqb4ADRtf/moNwLmAhZ7JWgAR7KTaLS2X/Pg8WL9E/2DQYss2FDWAdpIqoA4kJuCWDobcSHQwYncw5jcOEG4VQd9pcpWM6OgT0yKqfc7F7uDPYZap1sYBYfEO3E/1mebfbkZkIIjoTvjB+TKzp3viFEH2BJ6j1/Ksx5KhciBehVY64Ys28Xwb/rlojMScF4MCuQKlej7M1Qh7Kz8UOvPNvppCRJD2tR098lOq+h/xjJbekSuaIh2OxmW58Cpvz8BzmFeGYUuJYEPpCXmZLnuEzVxCL/g75ypjcnjmW9hFgAUrfqxzMsM7NgCGLwVLqPGssoH7ZBDD0RgFQ/JSh64Hcxd1yKTAC8lw7wxZLSEH3Fdg5gduvviJCzQAWMARH+Zk5uGmTkfrkMxCaqJtkAAMQ9l6W6B7DDaWKRPMA2ppGXcgAre3pfvjTLlBW4u016gN0eOfxfVYFppgcfIdqdzR+W7Yh9Ao8IkS7OHPlP/QrIPJ6QmrooRM4Hxuvm3XZDDVyPkIYC8PV+qRCWPdDvKD7X8WaRKUjcueDZb7nWuuNqAtOccC6rizcQOnYg5z/hUdcNTseJ6WfPPgM6dhkEJ9dl8VRF4CHODK5jdsE9gUobrIiTetgKADBQH/J9LC98phHTt1SNfUbvyi/osFZ43W/0o0KySp412Ry2AFegNERidOdsE84iN2EtH8kXPyHInCsJKsYF2FG8+Oe/vZUpSAje0qgAAIyEQHkkZLqejO7/UZgc6PZbH1tEaQQAcrzct3udwseY+CMAXABVPA8FyHiCee8qB3/dgmhaF5WJmzdGEAv16utjJU2HHqmfpm/Us8rRwCs2kYNWp7lToWF8l5qpj62ehqwHfdbgYvWm2XeHOUTQ/kT5KdJdKfhEXyFHOTgOZffp6x54EpB0i1L5bqZ4PtkEUa4SrhS40hyMtz6tX80is61Hk5eddkToss6Vy7XoOFxB9yP11dZ1xpCkYHwcuY9fgQQnVV+CErVjpWoZnxYXxPeSqtmdg7nCZw2MbRv78+74QRFTZU9kNs6ELi/3k+gzbPYNsgJGh4Ar1bdMFuT2BsmhnsnLeuoi6kaujd0qSGO1Nhx1KDJhmvdbjKZleHg9hNySTIZvdc3KtARCT8qVCs6AcVKS3UHzdZ9LJ5AAA="
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-50 text-white p-2">
        <h2>{image.title}</h2>
        <div className="flex items-center">
          <button
            onClick={handleLikeClick}
            className={`bg-transparent hover:bg-transparent text-white rounded-full p-2 ${
              !session && "cursor-not-allowed opacity-50"
            }`}
            disabled={!session}
            style={{ pointerEvents: !session ? "none" : "auto" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={likes > 0 ? "text-red-500" : "text-white"}
            />
          </button>
          <span
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
            className="text-white ml-2"
          >
            Likes: {likes}
          </span>
          {users.length > 0 && (
            <div className="absolute bottom-10 right-0 bg-black bg-opacity-75 text-white p-2 rounded-lg shadow-lg w-100 h-100">
              {users.map((user, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                    loading="lazy"
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageComponent;
