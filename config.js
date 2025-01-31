module.exports = {
    "token": "TOKEN",
    "guildId": "903788106984062987",
    "owners": ["387137154729377792"],
    "activity": {
        "interval": 1, // Kaç dakikada bir aktivite değiştirecek (Eğer tek bir tane metin var ise aşağıda uzun bir süre belirtin)
        "text": [
            "kTicketBot",
            "Yeni Nesil Destek Botu",
        ]
    },
    "ticket": {
        "prefix": "!",
        "prefixCommands": [
            {
                "command": "başka", // Komutun adı
                "reply": "[ticketOwner] başka bir sorunuz veya sorununuz yoksa bu mesajın altındaki butondan talebi kapatabilirsiniz.", // Yanıt [ticketOwner], [assignedStaff], [categoryName]
                "onlyTicket": true, // Sadece talep kanallarında mı kullanılabilir komut?
                "onlyStaff": true, // Sadece yetkililer tarafından mı kullanılabilir komut?
                "instaDelete": true, // Komut yazılınca direkt silinsin mi?
                "button": {
                    "id": "TicketCloseButton",
                    "name": "Talebi Kapat",
                    "emoji": "🔒",
                    "type": 2
                }
            }
        ],
        "type": "button", // Button veya Menu veya Modal
        "otherLanguage": "en-US", // Eğer mesajlarda çevirisi olmayan bir dil olursa hangi dili göstereceğini belirtin
        "staffRankingSystem": {
            "status": true,
            "dailyRanking": true,
            "weeklyRanking": true,
            "monthlyRanking": true,
        },
        "mentionCategoryStaffsWhenTicketOpened": {
            "status": true, // Talep açıldıktan sonra kanala @everyone atsın mı?
            "deleteAfterMention": false, // @everyone atıldıktan sonra silsin mi?
        },
        "mentionOwnerWhenTicketReopened": {
            "status": false, // Talep yeniden açıldıktan sonra kanala talep sahibi etiketlensin mi?
        },
        "onlyStaffCanCloseTickets": {
            "status": true, // Sadece destek ekibinin desteği kapatamayacağını belirler (Sadece destek ekibinin kapatabilmesini istiyorsanız true, desteğe ekli olan herkesin kapatabilmesini istiyorsanız false)
            "embed": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Destek taleplerini sadece yetkililer kapatabilir. Onlardan destek talebini kapatmalarını talep etmen gerekli.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Tickets can only closed by the staffs. You need to ask them to close your support request.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            }
        },
        //
        "sendRateMessageToUserAfterTicketClosed": {
            "status": true,
            "sendTranscript": true, // 
            "button": {
                "id": "TicketRatingButton",
                "name": "⭐",
                "type": 2,
            },
            "embed": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Merhaba, talebiniz kapandı, kendimizi geliştirmemiz için talepteki deneyiminizi puanlayabilir misiniz?\n\nTalebinizle ilgilenen yetkili: [staff]",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Hello, your ticket has been closed, can you rate your experience in the request so that we can improve ourselves?\n\nStaff who was take care of your ticket: [staff]",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "afterRatingEmbed": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Değerlendirmeniz için teşekkür ederiz.\n\nVerilen puan: [rating]",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Thank you for your review.\n\nRating given: [rating]",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
        },
        //
        "askHowDidYouHearUs": {
            "status": true,
            "answerLogChannelId": "1193554967018078219",
            "customId": "HowDidYouHearModal",
            "inputCustomId": "SurveyQuestion",
            "embed": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Cevabınız için teşekkür ederiz. Tekrar tıklayarak talep açabilirsiniz.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Thank you for your answer. You can create ticket by repressing the button.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "tr": {
                "title": "Anket",
                "input": [
                    {
                        "label": "Bizi Nereden Duydunuz?",
                        "type": "paragraph",
                        "minLength": 1,
                        "maxLength": 500,
                        "required": true,
                    }
                ]
            },
            "en-US": {
                "title": "Survey",
                "input": [
                    {
                        "label": "How Did You Hear Us?",
                        "type": "paragraph",
                        "minLength": 1,
                        "maxLength": 500,
                        "required": true,
                    }
                ]
            },
        },
        //
        "transcript": {
            "status": true, // Talep geçmişi (Transcript) olacaksa true, olmayacaksa false yazın.
            "saveImages": true, // Talep geçmişi resimleri kaydetmesini istiyorsanız true, istemiyorsanız false yazın. (DOSYA BOYUTUNU ARTTIRIR!)
            "transcriptFolder": "transcripts", // Talep geçmişleri hangi klasöre kaydedilecek? Kaydedilmesini istemiyorsanız false yazın. 
            "transcriptLogChannelId": "1256050606011977841", // Talep geçmişleri hangi kanala atılacak?
        },
        //
        "ticketOpenerButton": {
            "id": "TicketButton",
            "name": "",
            "emoji": "📥",
            "type": 1
        },
        //
        "ticketCategorySelecterMenu": {
            "customId": "TicketMenuRow",
            "placeholder": {
                "tr": "Lütfen bir kategori seçin.",
                "en-US": "Please choose a category.",
            },
        },
        "ticketCategorySelectionComponents": {
            "button": {
                "id": "TicketCategoryButton"
            },
            "menu": {
                "id": "TicketCategoryMenu"
            }
        },
        "closeTicket": {
            "button": {
                "id": "TicketCloseButton",
                "tr": {
                    "name": "Talebi Kapat",
                    "emoji": "🔒",
                    "type": 2
                },
                "en-US": {
                    "name": "Close Ticket",
                    "emoji": "🔒",
                    "type": 2
                },
            }
        },
        "ticketAssignment": { // Yetkili devralma sistemi olsun mu?
            "status": true,
            "button": {
                "id": "TicketAssignButton",
                "tr": {
                    "name": "Talebi Devral",
                    "emoji": "🙌",
                    "type": 1
                },
                "en-US": {
                    "name": "Assign Ticket",
                    "emoji": "🙌",
                    "type": 1
                },
            }
        },
        "ticketDelete": {
            "button": {
                "id": "TicketDeleteButton",
                "tr": {
                    "name": "Talebi Sil",
                    "emoji": "🗑️",
                    "type": 4
                },
                "en-US": {
                    "name": "Delete Ticket",
                    "emoji": "🗑️",
                    "type": 4
                },
            }
        },
        "ticketReopen": {
            "button": {
                "id": "TicketReopenButton",
                "tr": {
                    "name": "Talebi Yeniden Aç",
                    "emoji": "🔁",
                    "type": 2
                },
                "en-US": {
                    "name": "Reopen Ticket",
                    "emoji": "🔁",
                    "type": 2
                },
            }
        },
        "ticketBlacklist": {
            "status": "update", // reply veya update
            "embed": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Destek açamazsın, karalisteye eklisin!",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "You cannot create a ticket, you are blacklisted!",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            }
        },
        "categories": [
            {
                "tr": {
                    "name": "Satış Öncesi Destek",
                    "emoji": "❔",
                    "description": "Satış öncesi desteği açarak aklınızdaki soruları giderebilirsiniz.",
                    "channelName": "satış-öncesi",
                    "requiredRoleId": [],
                    "staffRoleId": ["929140726988685422"],
                    "buttonType": 1,
                    "questions": [
                        { "label": "Adınız", "type": "short", "minLength": 1, "maxLength": 32, "required": true },
                        { "label": "Sorunuzu Belirtin", "type": "paragraph", "minLength": 1, "maxLength": 500, "required": true },
                    ],
                    "parentCategoryId": "1256050676514164786"
                },
                "en-US": {
                    "name": "Pre Sales Support",
                    "emoji": "❔",
                    "description": "You can remove your questions by opening pre sales support.",
                    "channelName": "pre-sales",
                    "requiredRoleId": [],
                    "staffRoleId": ["929140726988685422"],
                    "buttonType": 1,
                    "questions": [
                        { "label": "Your Name", "type": "short", "minLength": 1, "maxLength": 32, "required": true },
                        { "label": "Describe Your Question", "type": "paragraph", "minLength": 1, "maxLength": 500, "required": true },
                    ],
                    "parentCategoryId": "1256050676514164786"
                },
            },
            {
                "tr": {
                    "name": "Müşteri Destek",
                    "emoji": "⭐",
                    "description": "Müşteri desteği açarak yardım alabilirsiniz.",
                    "channelName": "müşteri",
                    "requiredRoleId": ["1079421720890449920"],
                    "staffRoleId": ["929140726988685422"],
                    "buttonType": 1,
                    "questions": [],
                    "parentCategoryId": "1256050676514164786"
                },
                "en-US": {
                    "name": "Customer Support",
                    "emoji": "⭐",
                    "description": "You can get help by opening customer support.",
                    "channelName": "customer",
                    "requiredRoleId": ["1079421720890449920"],
                    "staffRoleId": ["929140726988685422"],
                    "buttonType": 1,
                    "questions": [],
                    "parentCategoryId": "1256050676514164786"
                },
            },
        ],
        "messages": {
            "dontHavePerm": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Bunu yapmak için yeterli yetkiye sahip değilsin.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "You don't have permission to do that.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "setupEmbed": {
                "tr": {
                    "title": "Destek talebi nasıl açarım?",
                    "description": "Aşağıdaki '📥' butonuna tıklayarak karşınıza çıkan menüden destek almak istediğiniz kategoriyi seçin. Daha sonra karşınıza çıkan formda neden talep açmak istediğinizi belirttikten sonra size özel bir destek talebi kanalı açılacaktır. Destek talebinden merak ettiğiniz soruları sorabilir ve sipariş verebilirsiniz.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "How can I open ticket?",
                    "description": "By clicking the '📥' button below, select the category you want to get support from from the menu that appears. Then, after you specify why you want to open a request in the form that appears, a special ticket channel will be opened for you. You can ask questions and place orders via the ticket.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "selectionEmbed": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Aşağıdan bir kategori seçin.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Choose a category down there.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "doesNotHaveRequiredRole": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Bu kategoride destek talebi açabilmeniz için [roles] rolüne sahip olmanız gerekmekte.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "You need to have [roles] role to open ticket at that category.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "ticketAlreadyExists": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Zaten aktif olan [channel] adlı bir destek talebiniz bulunmakta.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "You already have an active support request called [channel].",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "ticketOpened": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Destek talebin açıldı! [channel]",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Your ticket has been opened! [channel]",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "newTicketChannel": {
                "createdBy": {
                    "status": true,
                    "tr": "Talebi Oluşturan",
                    "en-US": "Created By",
                },
                "category": {
                    "status": true,
                    "tr": "Destek Kategorisi",
                    "en-US": "Ticket Category",
                },
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Merhaba, [user]. Talebinize hoş geldiniz!\n\nBu kanaldan yetkililerle iletişime geçebilir, destek alabilirsiniz. Talebi kapatmak isterseniz sabitlenenlerdeki mesajda bulunan Talebi Kapat butonuna basarak talebi kapatabilirsiniz.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Hello, [user]. Welcome to your ticket!\n\nYou can contact the support team and get support from this channel. If you want to close the request, you can close the request by clicking the Close Request button in the pinned message.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            },
            "ticketClosed": {
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Talep kapatıldı. Aşağıdan talebe ne yapılacağını seçin.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Ticket has been closed. Choose what to do with the ticket below.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            },
            "ticketReopened": {
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Talep [staff] adlı yetkili tarafından yeniden açıldı.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Ticket has been reopened by [staff].",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            },
            "ticketDeleted": {
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Talebinin silinmesi istendi. Talep siliniyor...",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Ticket was requested to be deleted. Ticket is being deleted...",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            },
            "ticketOwnerLeft": {
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Talep sahibi sunucudan ayrıldı.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Ticket owner left the guild.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            },
            "ticketOwnerJoined": {
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Talep sahibi sunucuya katıldı.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Ticket owner joined the guild.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            },
            "transcriptLog": {
                "ticketOwner": {
                    "status": true,
                    "content": "Ticket Owner",
                },
                "ticketAssignedStaff": {
                    "status": true,
                    "content": "Assigned Staff",
                    "undefined": "Staff Not Assigned"
                },
                "ticketCloser": {
                    "status": true,
                    "content": "Ticket Closer",
                    "undefined": "Undefined"
                },
                "ticketCategory": {
                    "status": true,
                    "content": "Ticket Category",
                },
                "ticketLocale": {
                    "status": true,
                    "content": "Ticket Locale",
                },
                "embed": {
                    "title": "A Ticket Was Closed",
                    "description": "[user]'s ticket was closed.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                }
            },
            "staffAssignedToTicket": {
                "tr": {
                    "title": "Destek Talebi",
                    "description": "Talebi [staff] adlı yetkili devraldı. Bu destek talebinde sizinle kendisi ilgilenecek.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
                "en-US": {
                    "title": "Ticket",
                    "description": "Ticket was assigned by [staff]. They will take care of you on this ticket.",
                    "color": "#bada55",
                    "image": false,
                    "footer": "kTicketBot"
                },
            },
            "blacklist": {
                "alreadyIn": {
                    "en-US": "[user] is already in blacklist.",
                    "tr": "[user] adlı üye zaten karaliste içerisinde."
                },
                "notIn": {
                    "en-US": "[user] is not in blacklist.",
                    "tr": "[user] adlı üye karalistede değil."
                },
                "successfullyAdded": {
                    "en-US": "Successfully added [user] to blacklist.",
                    "tr": "[user] adlı üye karalisteye eklendi."
                },
                "successfullyRemoved": {
                    "en-US": "Successfully removed [user] from blacklist.",
                    "tr": "[user] adlı üye karalisteden çıkarıldı."
                },
                "blacklistEmpty": {
                    "en-US": "Blacklist is empty.",
                    "tr": "Karaliste boş."
                }
            },
            "staff-ranking": {
                "rankEmoji": ["🥇", "🥈", "🥉"],
                "ranking": {
                    "tr": "[rank] [staff]\nㅤ• **[ticketCount]** tane talebe yardımcı olmuş.\nㅤ• Taleplerde toplam **[messageCount]** mesaj atmış.\nㅤ• Ortalama puanı **[averageRating]** [ratingEmoji]",
                    "en-US": "[rank] [staff]\nㅤ• Helped **[ticketCount]** tickets.\nㅤ• Sent **[messageCount]** messages in tickets.\nㅤ• Average rating **[averageRating]** [ratingEmoji]"
                },
                "embed": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Yetkili sıralaması aşağıdadır.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot - Sayfa [currentPage]/[maxPage]"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Staff ranking is below.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot - Page [currentPage]/[maxPage]"
                    }
                },
                "previousButton": {
                    "id": "Previous",
                    "tr": {
                        "name": "Önceki",
                        "emoji": "⬅️",
                        "type": 1
                    },
                    "en-US": {
                        "name": "Previous",
                        "emoji": "⬅️",
                        "type": 1
                    },
                },
                "nextButton": {
                    "id": "Next",
                    "tr": {
                        "name": "Sonraki",
                        "emoji": "➡️",
                        "type": 1
                    },
                    "en-US": {
                        "name": "Next",
                        "emoji": "➡️",
                        "type": 1
                    },
                },
                "pagesDisabled": {
                    "tr": "Aradan uzun bir zaman geçtiği için sayfalar pasif hâle getirildi.",
                    "en-US": "As a long time passed, the pages became inactive."
                },
                "onlyUsableByCommandSender": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Bu düğmeleri sadece komudu kullanan kişi kullanabilir.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "Only command user can use those buttons.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    }
                },
            },
            "reassign-ticket": {
                "memberDoesntHavePerm": {
                    "tr": {
                        "title": "Destek Talebi",
                        "description": "Etiketlediğin kişi yeterli yetkiye sahip değil.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                    "en-US": {
                        "title": "Ticket",
                        "description": "The person you mentioned does not have sufficient authority.",
                        "color": "#bada55",
                        "image": false,
                        "footer": "kTicketBot"
                    },
                }
            }
        }
    }
}