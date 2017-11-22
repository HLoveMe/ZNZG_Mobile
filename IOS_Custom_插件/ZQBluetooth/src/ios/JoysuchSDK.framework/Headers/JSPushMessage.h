//
//  JSPushMessage.h
//  JoysuchSDK
//
//  Created by seekcy on 2017/1/24.
//  Copyright © 2017年 com.joysuch. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JSPushMessage : NSObject

@property (nonatomic, strong) NSString *userID; // 用户id
@property (nonatomic, strong) NSString *railID; // 电子围栏id
@property (nonatomic, strong) NSString *railName; // 电子围栏名称
@property (nonatomic) int type; // 1进入 2退出
@property (nonatomic, strong) NSString *messageType; // 消息类型
@property (nonatomic, strong) NSString *messageValue; // 消息值
@property (nonatomic) long timeStampMillisecond; // 收到消息时的时间戳


@end
